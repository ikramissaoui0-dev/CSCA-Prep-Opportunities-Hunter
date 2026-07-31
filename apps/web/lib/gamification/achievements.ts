import "server-only";

import { eq, and, gte, sql } from "drizzle-orm";
import { achievements, userAchievements, examResults, examSessions, lessonProgress, courseProgressView, type Database } from "@csca/db";
import { logger } from "@/lib/logger";
import { awardPoints } from "./points";
import { computeCurrentStreakDays, WEEKLY_STREAK_MILESTONE_DAYS } from "./streaks";

type AchievementCode = "first_exam" | "perfect_score" | "ten_exams" | "week_streak" | "bookworm" | "course_complete";

// Split by trigger so an exam submission doesn't pay for lesson-progress
// queries and vice versa — each event only checks the codes it could
// possibly newly satisfy.
const CODES_BY_TRIGGER: Record<"exam" | "lesson", AchievementCode[]> = {
  exam: ["first_exam", "perfect_score", "ten_exams", "week_streak"],
  lesson: ["bookworm", "course_complete"],
};

async function isSatisfied(db: Database, userId: string, code: AchievementCode): Promise<boolean> {
  switch (code) {
    case "first_exam": {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(examResults).innerJoin(examSessions, eq(examSessions.id, examResults.sessionId)).where(eq(examSessions.userId, userId));
      return (row?.count ?? 0) >= 1;
    }
    case "ten_exams": {
      const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(examResults).innerJoin(examSessions, eq(examSessions.id, examResults.sessionId)).where(eq(examSessions.userId, userId));
      return (row?.count ?? 0) >= 10;
    }
    case "perfect_score": {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(examResults)
        .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
        .where(and(eq(examSessions.userId, userId), eq(examResults.percentage, 100)));
      return (row?.count ?? 0) >= 1;
    }
    case "week_streak": {
      const streak = await computeCurrentStreakDays(db, userId);
      return streak >= WEEKLY_STREAK_MILESTONE_DAYS;
    }
    case "bookworm": {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(lessonProgress)
        .where(and(eq(lessonProgress.userId, userId), sql`${lessonProgress.completedAt} is not null`));
      return (row?.count ?? 0) >= 5;
    }
    case "course_complete": {
      const [row] = await db
        .select({ id: courseProgressView.courseId })
        .from(courseProgressView)
        .where(and(eq(courseProgressView.userId, userId), gte(courseProgressView.completedLessons, courseProgressView.totalLessons), gte(courseProgressView.totalLessons, 1)))
        .limit(1);
      return !!row;
    }
  }
}

/**
 * Best-effort, same spirit as the AI recommendation batch: a failed
 * check here must never surface as a broken exam submission or lesson
 * completion, so every caller wraps this in its own try/catch (see
 * actions-core.ts and progress-actions-core.ts).
 */
export async function checkAndAwardAchievements(db: Database, userId: string, trigger: "exam" | "lesson"): Promise<void> {
  const catalog = await db.select().from(achievements);
  const catalogByCode = new Map(catalog.map((a) => [a.code as AchievementCode, a]));

  const alreadyEarned = await db.select({ achievementId: userAchievements.achievementId }).from(userAchievements).where(eq(userAchievements.userId, userId));
  const earnedIds = new Set(alreadyEarned.map((r) => r.achievementId));

  for (const code of CODES_BY_TRIGGER[trigger]) {
    const achievement = catalogByCode.get(code);
    if (!achievement || earnedIds.has(achievement.id)) continue;

    try {
      if (!(await isSatisfied(db, userId, code))) continue;

      await db.insert(userAchievements).values({ userId, achievementId: achievement.id }).onConflictDoNothing();
      await awardPoints(db, userId, achievement.points, "achievement_earned", achievement.id, achievement.title);
    } catch (error) {
      logger.error({ err: error, userId, code }, "achievement check failed");
    }
  }
}
