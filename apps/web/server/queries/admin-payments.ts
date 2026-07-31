import "server-only";

import { eq, and, ilike, sql, desc, type SQL } from "drizzle-orm";
import { payments, adminUserDirectoryView } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type PaymentListFilters = {
  search?: string;
  status?: "all" | "succeeded" | "failed" | "refunded";
  page: number;
  pageSize: number;
};

export type PaymentListRow = {
  id: string;
  userEmail: string | null;
  userFullName: string | null;
  amountCents: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: Date;
};

/**
 * Read-only, admin-only, by design: payments is written exclusively by
 * the Phase 9 Stripe webhook's service-role client (see
 * 0004_commerce_schema.sql) — there is no create/update/delete action
 * for this table anywhere in the app, on purpose. This will list nothing
 * until that webhook ships.
 */
export async function listPayments(userId: string, role: UserRole, filters: PaymentListFilters): Promise<{ rows: PaymentListRow[]; total: number }> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(ilike(adminUserDirectoryView.email, pattern));
    }
    if (filters.status && filters.status !== "all") {
      conditions.push(eq(payments.status, filters.status));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRow] = await Promise.all([
      tx
        .select({
          id: payments.id,
          userEmail: adminUserDirectoryView.email,
          userFullName: adminUserDirectoryView.fullName,
          amountCents: payments.amountCents,
          currency: payments.currency,
          status: payments.status,
          description: payments.description,
          createdAt: payments.createdAt,
        })
        .from(payments)
        .innerJoin(adminUserDirectoryView, eq(adminUserDirectoryView.id, payments.userId))
        .where(where)
        .orderBy(desc(payments.createdAt))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(payments)
        .innerJoin(adminUserDirectoryView, eq(adminUserDirectoryView.id, payments.userId))
        .where(where)
        .then((r) => r[0]?.count ?? 0),
    ]);

    return { rows, total: totalRow };
  });
}
