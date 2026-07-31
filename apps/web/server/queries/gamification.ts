import "server-only";

import { eq, asc, notInArray } from "drizzle-orm";
import { leaderboardView, achievements, userAchievements } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";
import { computeCurrentStreakDays } from "@/lib/gamification/streaks";
import { computeLevel, type LevelInfo } from "@/lib/gamification/levels";

export type LeaderboardRow = {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  totalPoints: number;
  rank: number;
};

const LEADERBOARD_TOP_N = 20;

/**
 * Top N plus the caller's own row pinned at the end if they're not
 * already in the top N — the standard "here's the top of the board, and
 * here's where you are" leaderboard shape, rather than making someone
 * outside the top 20 scroll through a table to find themselves.
 */
export async function getLeaderboard(userId: string, role: UserRole): Promise<{ top: LeaderboardRow[]; own: LeaderboardRow | null }> {
  return withRlsContext(userId, role, async (tx) => {
    const top = await tx
      .select({ userId: leaderboardView.userId, fullName: leaderboardView.fullName, avatarUrl: leaderboardView.avatarUrl, totalPoints: leaderboardView.totalPoints, rank: leaderboardView.rank })
      .from(leaderboardView)
      .orderBy(asc(leaderboardView.rank))
      .limit(LEADERBOARD_TOP_N);

    if (top.some((row) => row.userId === userId)) {
      return { top, own: null };
    }

    const [own] = await tx
      .select({ userId: leaderboardView.userId, fullName: leaderboardView.fullName, avatarUrl: leaderboardView.avatarUrl, totalPoints: leaderboardView.totalPoints, rank: leaderboardView.rank })
      .from(leaderboardView)
      .where(eq(leaderboardView.userId, userId));

    return { top, own: own ?? null };
  });
}

export type AchievementSummary = {
  code: string;
  title: string;
  description: string;
  iconUrl: string | null;
  points: number;
  earnedAt: Date | null;
};

export type GamificationSummary = {
  totalPoints: number;
  rank: number | null;
  level: LevelInfo;
  currentStreakDays: number;
  earned: AchievementSummary[];
  locked: AchievementSummary[];
};

export async function getGamificationSummary(userId: string, role: UserRole): Promise<GamificationSummary> {
  return withRlsContext(userId, role, async (tx) => {
    const [ownRow] = await tx
      .select({ totalPoints: leaderboardView.totalPoints, rank: leaderboardView.rank })
      .from(leaderboardView)
      .where(eq(leaderboardView.userId, userId));

    const earnedRows = await tx
      .select({
        code: achievements.code,
        title: achievements.title,
        description: achievements.description,
        iconUrl: achievements.iconUrl,
        points: achievements.points,
        earnedAt: userAchievements.earnedAt,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
      .where(eq(userAchievements.userId, userId));

    const earnedIds = await tx.select({ achievementId: userAchievements.achievementId }).from(userAchievements).where(eq(userAchievements.userId, userId));
    const earnedIdList = earnedIds.map((r) => r.achievementId);

    const lockedRows = await tx
      .select({ code: achievements.code, title: achievements.title, description: achievements.description, iconUrl: achievements.iconUrl, points: achievements.points })
      .from(achievements)
      .where(earnedIdList.length > 0 ? notInArray(achievements.id, earnedIdList) : undefined);

    const totalPoints = ownRow?.totalPoints ?? 0;

    return {
      totalPoints,
      rank: ownRow?.rank ?? null,
      level: computeLevel(totalPoints),
      currentStreakDays: await computeCurrentStreakDays(tx, userId),
      earned: earnedRows.map((r) => ({ ...r, earnedAt: r.earnedAt })),
      locked: lockedRows.map((r) => ({ ...r, earnedAt: null })),
    };
  });
}
