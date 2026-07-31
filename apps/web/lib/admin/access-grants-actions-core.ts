import "server-only";

import { eq, and, isNull, sql } from "drizzle-orm";
import { studentAccessGrants, auditLogs, type Database, type PlanTier } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { normalizeEmail, type GrantAccessInput, type ExpirationOptionInput } from "@/lib/validation/access-grants";
import { computeExpiresAt } from "./access-grant-expiration";

/**
 * Raw join against auth.users rather than the admin_user_directory view
 * (used elsewhere in the admin section) — that view's own row-visibility
 * check reads auth.jwt(), which is only populated under an RLS-context
 * connection (withRlsContext). Every write here runs through the
 * elevated `db` client instead (student_access_grants has no write
 * policy for `authenticated` at all — see 0012's migration comment), so
 * auth.jwt() would be empty and the view would silently return zero
 * rows. The elevated client already bypasses RLS, so querying auth.users
 * directly is both correct and no less safe here.
 */
export async function findUserIdByEmail(tx: Database, email: string): Promise<string | null> {
  const rows = await tx.execute<{ id: string }>(
    sql`select p.id from public.profiles p join auth.users u on u.id = p.id where lower(u.email) = ${email} limit 1`,
  );
  return rows[0]?.id ?? null;
}

async function logAudit(
  tx: Database,
  entry: {
    actorId: string | null;
    action: string;
    targetId?: string | null;
    targetEmail?: string | null;
    previousValue?: unknown;
    newValue?: unknown;
  },
): Promise<void> {
  await tx.insert(auditLogs).values({
    actorId: entry.actorId,
    action: entry.action,
    targetType: "student_access_grant",
    targetId: entry.targetId ?? null,
    targetEmail: entry.targetEmail ?? null,
    previousValue: (entry.previousValue as object) ?? null,
    newValue: (entry.newValue as object) ?? null,
  });
}

/**
 * Scenario A/B from this feature's spec, both in one upsert: if an
 * active (non-revoked) grant already exists for this email, extend/
 * update it in place — "grant again" to an already-granted student is
 * never a second row (see uq_student_access_grants_active_email).
 * Otherwise insert a new one, immediately linked to an existing account
 * if one matches this email, or left unlinked (PENDING_REGISTRATION,
 * picked up automatically at signup by the handle_new_user trigger).
 */
export async function grantFreeAccessCore(
  admin: SessionUser,
  input: GrantAccessInput,
): Promise<ActionResult<{ grantId: string; wasExisting: boolean }>> {
  const email = normalizeEmail(input.email);
  const expiresAt = computeExpiresAt(input.expirationOption, input.customExpiresAt);

  try {
    const result = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(studentAccessGrants)
        .where(and(eq(studentAccessGrants.email, email), isNull(studentAccessGrants.revokedAt)));

      const matchedUserId = await findUserIdByEmail(tx, email);

      if (existing) {
        await tx
          .update(studentAccessGrants)
          .set({
            grantedTier: input.grantedTier,
            expiresAt,
            adminNote: input.adminNote ?? existing.adminNote,
            userId: existing.userId ?? matchedUserId,
            updatedAt: new Date(),
          })
          .where(eq(studentAccessGrants.id, existing.id));

        await logAudit(tx, {
          actorId: admin.id,
          action: "access_extended",
          targetId: existing.id,
          targetEmail: email,
          previousValue: { grantedTier: existing.grantedTier, expiresAt: existing.expiresAt },
          newValue: { grantedTier: input.grantedTier, expiresAt },
        });

        return { grantId: existing.id, wasExisting: true };
      }

      const [created] = await tx
        .insert(studentAccessGrants)
        .values({
          email,
          userId: matchedUserId,
          grantedTier: input.grantedTier,
          grantedBy: admin.id,
          expiresAt,
          adminNote: input.adminNote || null,
        })
        .returning({ id: studentAccessGrants.id });

      await logAudit(tx, {
        actorId: admin.id,
        action: "access_granted",
        targetId: created!.id,
        targetEmail: email,
        newValue: { grantedTier: input.grantedTier, expiresAt, linkedToExistingAccount: !!matchedUserId },
      });

      return { grantId: created!.id, wasExisting: false };
    });

    return { success: true, data: result };
  } catch (error) {
    return actionFailure(error);
  }
}

/**
 * Row-level edits from the admin table (Extend / Change expiration /
 * Grant permanent / Change tier / edit note) — identified by grant id,
 * unlike grantFreeAccessCore's identification by email. Every field is
 * optional so a single "Extend" click can send just the new expiration
 * without disturbing the tier or note.
 */
export async function updateAccessGrantCore(
  admin: SessionUser,
  input: { grantId: string; grantedTier?: PlanTier; expirationOption?: ExpirationOptionInput; customExpiresAt?: string; adminNote?: string },
): Promise<ActionResult<null>> {
  try {
    await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(studentAccessGrants).where(eq(studentAccessGrants.id, input.grantId));
      if (!existing) {
        throw new AppError("NOT_FOUND", "This access grant doesn't exist.");
      }
      if (existing.revokedAt) {
        throw new AppError("VALIDATION_ERROR", "This access has been revoked — grant it again instead of editing it.");
      }

      const nextExpiresAt = input.expirationOption
        ? computeExpiresAt(input.expirationOption, input.customExpiresAt)
        : existing.expiresAt;

      await tx
        .update(studentAccessGrants)
        .set({
          grantedTier: input.grantedTier ?? existing.grantedTier,
          expiresAt: nextExpiresAt,
          adminNote: input.adminNote ?? existing.adminNote,
          updatedAt: new Date(),
        })
        .where(eq(studentAccessGrants.id, input.grantId));

      await logAudit(tx, {
        actorId: admin.id,
        action: "access_updated",
        targetId: existing.id,
        targetEmail: existing.email,
        previousValue: { grantedTier: existing.grantedTier, expiresAt: existing.expiresAt, adminNote: existing.adminNote },
        newValue: { grantedTier: input.grantedTier ?? existing.grantedTier, expiresAt: nextExpiresAt, adminNote: input.adminNote ?? existing.adminNote },
      });
    });

    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function revokeAccessGrantCore(admin: SessionUser, grantId: string): Promise<ActionResult<null>> {
  try {
    await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(studentAccessGrants).where(eq(studentAccessGrants.id, grantId));
      if (!existing) {
        throw new AppError("NOT_FOUND", "This access grant doesn't exist.");
      }
      if (existing.revokedAt) {
        return; // Already revoked — idempotent no-op, not an error.
      }

      await tx.update(studentAccessGrants).set({ revokedAt: new Date(), updatedAt: new Date() }).where(eq(studentAccessGrants.id, grantId));

      await logAudit(tx, {
        actorId: admin.id,
        action: "access_revoked",
        targetId: existing.id,
        targetEmail: existing.email,
        previousValue: { revokedAt: null },
        newValue: { revokedAt: new Date().toISOString() },
      });
    });

    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}
