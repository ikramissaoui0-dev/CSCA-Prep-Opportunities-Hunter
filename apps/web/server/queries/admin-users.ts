import "server-only";

import { eq, and, or, ilike, sql, desc, type SQL } from "drizzle-orm";
import { adminUserDirectoryView } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type UserListFilters = {
  search?: string;
  role?: UserRole | "all";
  page: number;
  pageSize: number;
};

export type UserListRow = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: UserRole;
  createdAt: Date;
};

/**
 * Reads through admin_user_directory (see 0010_admin_user_directory.sql)
 * rather than `profiles` directly — that view is the only place email
 * (which lives in auth.users, outside this app's Postgres grants) is
 * available at all, and it already restricts every row to admin callers
 * on its own, so withRlsContext here is what makes that check see the
 * caller's actual role.
 */
export async function listUsers(
  adminId: string,
  adminRole: UserRole,
  filters: UserListFilters,
): Promise<{ rows: UserListRow[]; total: number }> {
  return withRlsContext(adminId, adminRole, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(or(ilike(adminUserDirectoryView.email, pattern), ilike(adminUserDirectoryView.fullName, pattern))!);
    }
    if (filters.role && filters.role !== "all") {
      conditions.push(eq(adminUserDirectoryView.role, filters.role));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRow] = await Promise.all([
      tx
        .select({
          id: adminUserDirectoryView.id,
          email: adminUserDirectoryView.email,
          fullName: adminUserDirectoryView.fullName,
          role: adminUserDirectoryView.role,
          createdAt: adminUserDirectoryView.createdAt,
        })
        .from(adminUserDirectoryView)
        .where(where)
        .orderBy(desc(adminUserDirectoryView.createdAt))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(adminUserDirectoryView)
        .where(where)
        .then((r) => r[0]?.count ?? 0),
    ]);

    return { rows, total: totalRow };
  });
}
