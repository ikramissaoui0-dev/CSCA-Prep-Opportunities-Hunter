import "server-only";

import { eq, and, ilike, sql, desc, type SQL } from "drizzle-orm";
import { subscriptions, adminUserDirectoryView } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type SubscriptionListFilters = {
  search?: string;
  status?: "all" | "trialing" | "active" | "past_due" | "canceled" | "incomplete" | "incomplete_expired" | "unpaid" | "paused";
  page: number;
  pageSize: number;
};

export type SubscriptionListRow = {
  id: string;
  userEmail: string | null;
  userFullName: string | null;
  planTier: "free" | "premium" | "premium_plus";
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

/**
 * Read-only, admin-only: subscriptions is written exclusively by the
 * Phase 9 Stripe webhook's service-role client — no create/update/delete
 * action exists here on purpose (see 0004_commerce_schema.sql).
 */
export async function listSubscriptions(
  userId: string,
  role: UserRole,
  filters: SubscriptionListFilters,
): Promise<{ rows: SubscriptionListRow[]; total: number }> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      conditions.push(ilike(adminUserDirectoryView.email, `%${filters.search}%`));
    }
    if (filters.status && filters.status !== "all") {
      conditions.push(eq(subscriptions.status, filters.status));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRow] = await Promise.all([
      tx
        .select({
          id: subscriptions.id,
          userEmail: adminUserDirectoryView.email,
          userFullName: adminUserDirectoryView.fullName,
          planTier: subscriptions.planTier,
          status: subscriptions.status,
          currentPeriodEnd: subscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
        })
        .from(subscriptions)
        .innerJoin(adminUserDirectoryView, eq(adminUserDirectoryView.id, subscriptions.userId))
        .where(where)
        .orderBy(desc(subscriptions.currentPeriodEnd))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(subscriptions)
        .innerJoin(adminUserDirectoryView, eq(adminUserDirectoryView.id, subscriptions.userId))
        .where(where)
        .then((r) => r[0]?.count ?? 0),
    ]);

    return { rows, total: totalRow };
  });
}
