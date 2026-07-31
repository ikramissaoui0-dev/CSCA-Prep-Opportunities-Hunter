import "server-only";

import { eq, and, or, ilike, desc, type SQL } from "drizzle-orm";
import { studentAccessGrants, adminUserDirectoryView } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";
import { EXPIRING_SOON_WINDOW_DAYS } from "@/lib/admin/access-grant-expiration";
import type { GrantedTierInput } from "@/lib/validation/access-grants";

export type AccessGrantStatus = "active" | "expiring_soon" | "expired" | "pending_registration" | "revoked";

export type AccessGrantRow = {
  id: string;
  email: string;
  userId: string | null;
  fullName: string | null;
  lastSignInAt: Date | null;
  // Narrower than the DB column's PlanTier (which also allows 'free') —
  // student_access_grants_tier_is_paid's check constraint guarantees a
  // grant's tier is always premium/premium_plus in practice.
  grantedTier: GrantedTierInput;
  grantedAt: Date;
  expiresAt: Date | null;
  revokedAt: Date | null;
  adminNote: string | null;
  status: AccessGrantStatus;
};

/**
 * Status is computed here, at read time, from revoked_at/expires_at/
 * user_id — never stored (see 0012_student_access_grants.sql's
 * comment). "expiring_soon" is a display-only refinement of "active"
 * (an active grant within EXPIRING_SOON_WINDOW_DAYS of expiring), not a
 * fifth real state.
 */
function deriveStatus(row: { userId: string | null; expiresAt: Date | null; revokedAt: Date | null }): AccessGrantStatus {
  if (row.revokedAt) return "revoked";
  if (row.expiresAt && row.expiresAt.getTime() <= Date.now()) return "expired";
  if (row.userId === null) return "pending_registration";
  if (row.expiresAt) {
    const daysUntilExpiry = (row.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    if (daysUntilExpiry <= EXPIRING_SOON_WINDOW_DAYS) return "expiring_soon";
  }
  return "active";
}

export type AccessGrantListFilters = {
  search?: string;
  status?: "all" | AccessGrantStatus;
  page: number;
  pageSize: number;
};

export async function listAccessGrants(
  adminId: string,
  adminRole: UserRole,
  filters: AccessGrantListFilters,
): Promise<{ rows: AccessGrantRow[]; total: number }> {
  return withRlsContext(adminId, adminRole, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(or(ilike(studentAccessGrants.email, pattern), ilike(adminUserDirectoryView.fullName, pattern))!);
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Status filtering happens in JS after deriving it (below) rather
    // than in SQL — the set of grants an admin is looking through is
    // small enough (this is a "my own students/clients" allowlist, not
    // a mass-market table) that paginating pre-filter and re-slicing
    // post-filter would be more complexity than it's worth here.
    const allRows = await tx
      .select({
        id: studentAccessGrants.id,
        email: studentAccessGrants.email,
        userId: studentAccessGrants.userId,
        fullName: adminUserDirectoryView.fullName,
        lastSignInAt: adminUserDirectoryView.lastSignInAt,
        grantedTier: studentAccessGrants.grantedTier,
        grantedAt: studentAccessGrants.grantedAt,
        expiresAt: studentAccessGrants.expiresAt,
        revokedAt: studentAccessGrants.revokedAt,
        adminNote: studentAccessGrants.adminNote,
      })
      .from(studentAccessGrants)
      .leftJoin(adminUserDirectoryView, eq(adminUserDirectoryView.id, studentAccessGrants.userId))
      .where(where)
      .orderBy(desc(studentAccessGrants.grantedAt));

    const withStatus: AccessGrantRow[] = allRows.map((row) => ({
      ...row,
      // See AccessGrantRow's own comment — grantedTier is DB-constrained
      // to premium/premium_plus even though the column's base type
      // (shared with subscriptions.plan_tier) also allows 'free'.
      grantedTier: row.grantedTier as GrantedTierInput,
      status: deriveStatus(row),
    }));
    const filtered =
      filters.status && filters.status !== "all"
        ? withStatus.filter((row) => row.status === filters.status)
        : withStatus;

    const start = (filters.page - 1) * filters.pageSize;
    return { rows: filtered.slice(start, start + filters.pageSize), total: filtered.length };
  });
}

export type AccessGrantStatusCounts = Record<"all" | AccessGrantStatus, number>;

/** Powers the filter tab counts — derives every row's status in JS
 * (same deriveStatus as listAccessGrants) rather than a second,
 * SQL-side status calculation that could drift from the first. */
export async function getAccessGrantStatusCounts(adminId: string, adminRole: UserRole): Promise<AccessGrantStatusCounts> {
  return withRlsContext(adminId, adminRole, async (tx) => {
    const rows = await tx
      .select({ userId: studentAccessGrants.userId, expiresAt: studentAccessGrants.expiresAt, revokedAt: studentAccessGrants.revokedAt })
      .from(studentAccessGrants);

    const counts: AccessGrantStatusCounts = { all: rows.length, active: 0, expiring_soon: 0, expired: 0, pending_registration: 0, revoked: 0 };
    for (const row of rows) {
      counts[deriveStatus(row)]++;
    }
    return counts;
  });
}
