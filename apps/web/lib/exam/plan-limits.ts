import "server-only";

import { eq, and, gte, sql } from "drizzle-orm";
import { examSessions, type Database } from "@csca/db";

// FREE gets 3 full simulations per calendar month; practice and the
// daily challenge stay unlimited for every tier (per Phase 9 scoping —
// only the flagship "full mock" mode is the upgrade lever). Shared by
// both the gate in lib/exam/actions-core.ts and the billing page's
// "X of 3 used" display, so the definition of "this month" can't drift
// between the two.
export const FREE_FULL_MOCK_MONTHLY_LIMIT = 3;

function startOfCurrentMonthUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export async function countFullMockAttemptsThisMonth(tx: Database, userId: string): Promise<number> {
  const [row] = await tx
    .select({ count: sql<number>`count(*)::int` })
    .from(examSessions)
    .where(and(eq(examSessions.userId, userId), eq(examSessions.mode, "full_mock"), gte(examSessions.startedAt, startOfCurrentMonthUtc())));
  return row?.count ?? 0;
}
