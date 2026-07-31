import "server-only";

import { pointsLedger, type Database } from "@csca/db";

// points_ledger has no insert/update policy for `authenticated` at all
// (0006_gamification_schema.sql: "written only by application logic") —
// every call site here must pass the elevated `db` (lib/db.ts), never a
// withRlsContext transaction, or the insert is simply refused by RLS.
export type PointsSourceType = "exam_completed" | "achievement_earned" | "streak_bonus" | "daily_challenge" | "lesson_completed";

export const POINTS = {
  examCompleted: 10,
  dailyChallenge: 20,
  lessonCompleted: 5,
  streakBonus: 50,
} as const;

export async function awardPoints(
  db: Database,
  userId: string,
  points: number,
  sourceType: PointsSourceType,
  sourceId: string | null,
  description: string,
): Promise<void> {
  if (points === 0) return; // points_ledger_nonzero check constraint — a no-op award is simply skipped, not an error.
  await db.insert(pointsLedger).values({ userId, points, sourceType, sourceId, description });
}
