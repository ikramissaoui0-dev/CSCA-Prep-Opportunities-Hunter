import "server-only";

import { eq, sql } from "drizzle-orm";
import { examSessions, type Database } from "@csca/db";

export const WEEKLY_STREAK_MILESTONE_DAYS = 7;

/**
 * Consecutive calendar days (in UTC, including today) with at least one
 * submitted exam session of any mode — "practice daily" is the habit
 * this is meant to reward, not any one specific mode. Walks backward
 * from today rather than doing a gaps-and-islands SQL query: a
 * student's realistic streak length is at most a few hundred days, so a
 * day-by-day loop against a small distinct-dates set is simpler than a
 * window-function query for the same result.
 */
export async function computeCurrentStreakDays(db: Database, userId: string): Promise<number> {
  const rows = await db
    .selectDistinct({ day: sql<string>`date(${examSessions.submittedAt})` })
    .from(examSessions)
    .where(eq(examSessions.userId, userId));

  const activeDays = new Set(rows.map((r) => r.day));
  if (activeDays.size === 0) return 0;

  let streak = 0;
  const cursor = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!activeDays.has(key)) break;
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}
