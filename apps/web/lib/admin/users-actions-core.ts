import "server-only";

import { eq } from "drizzle-orm";
import { profiles } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { UpdateUserRoleInput } from "@/lib/validation/user-admin";

/**
 * profiles denies self-service role updates by column-level grant (see
 * 0001_auth_foundation.sql) — this is the one place a role can actually
 * change, using the elevated `db` client to bypass RLS entirely, exactly
 * as that migration's own comment anticipates.
 */
export async function updateUserRoleCore(actingUser: SessionUser, input: UpdateUserRoleInput): Promise<ActionResult<null>> {
  // Blocked here, not just discouraged: an admin locking themselves out
  // of the only role allowed to grant admin back is unrecoverable without
  // direct DB access, so this is a hard rule, not a confirmation dialog.
  if (input.userId === actingUser.id) {
    return actionFailure(new AppError("VALIDATION_ERROR", "You can't change your own role."));
  }

  const [target] = await db.select({ id: profiles.id, role: profiles.role }).from(profiles).where(eq(profiles.id, input.userId));
  if (!target) {
    return actionFailure(new AppError("NOT_FOUND", "That user doesn't exist."));
  }
  if (target.role === input.role) {
    return { success: true, data: null };
  }

  await db.update(profiles).set({ role: input.role }).where(eq(profiles.id, input.userId));

  logger.info(
    { actingAdminId: actingUser.id, targetUserId: input.userId, fromRole: target.role, toRole: input.role },
    "user_role_changed",
  );

  return { success: true, data: null };
}
