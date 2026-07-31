import "server-only";

import { eq, and, sql } from "drizzle-orm";
import { lessons, lessonProgress } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { db, withRlsContext } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { awardPoints, POINTS } from "@/lib/gamification/points";
import { checkAndAwardAchievements } from "@/lib/gamification/achievements";
import { logger } from "@/lib/logger";

// A heartbeat every 30s while a lesson page is open (see the client
// timer in lesson-viewer.tsx) — capped server-side too, so a tampered
// client can't credit itself hours of "time spent" in one call.
const MAX_HEARTBEAT_SECONDS = 300;

/**
 * lesson_progress has no FK-level or RLS-level check tying it to
 * `lessons_read_accessible` — the owner policy only checks user_id, so a
 * crafted request could otherwise write progress for a lesson the
 * student's plan doesn't actually unlock. Selecting the lesson through
 * the same RLS policy the catalog uses is what closes that: if it's not
 * accessible, this returns nothing, and every write below is refused.
 */
async function assertLessonAccessible(userId: string, role: SessionUser["role"], lessonId: string): Promise<boolean> {
  const [row] = await withRlsContext(userId, role, (tx) => tx.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, lessonId)));
  return !!row;
}

export async function recordLessonAccessCore(user: SessionUser, lessonId: string): Promise<ActionResult<null>> {
  if (!(await assertLessonAccessible(user.id, user.role, lessonId))) {
    return actionFailure(new AppError("NOT_FOUND", "This lesson isn't available."));
  }

  await withRlsContext(user.id, user.role, (tx) =>
    tx
      .insert(lessonProgress)
      .values({ userId: user.id, lessonId })
      .onConflictDoUpdate({ target: [lessonProgress.userId, lessonProgress.lessonId], set: { lastAccessedAt: new Date() } }),
  );
  return { success: true, data: null };
}

export async function addLessonTimeSpentCore(user: SessionUser, lessonId: string, seconds: number): Promise<ActionResult<null>> {
  const clamped = Math.min(seconds, MAX_HEARTBEAT_SECONDS);
  if (!(await assertLessonAccessible(user.id, user.role, lessonId))) {
    return actionFailure(new AppError("NOT_FOUND", "This lesson isn't available."));
  }

  await withRlsContext(user.id, user.role, (tx) =>
    tx
      .insert(lessonProgress)
      .values({ userId: user.id, lessonId, timeSpentSeconds: clamped })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: { timeSpentSeconds: sql`${lessonProgress.timeSpentSeconds} + ${clamped}`, lastAccessedAt: new Date() },
      }),
  );
  return { success: true, data: null };
}

export async function setLessonCompletedCore(user: SessionUser, lessonId: string, completed: boolean): Promise<ActionResult<null>> {
  if (!(await assertLessonAccessible(user.id, user.role, lessonId))) {
    return actionFailure(new AppError("NOT_FOUND", "This lesson isn't available."));
  }

  const [existing] = await withRlsContext(user.id, user.role, (tx) =>
    tx
      .select({ completedAt: lessonProgress.completedAt })
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.lessonId, lessonId))),
  );
  const isNewCompletion = completed && !existing?.completedAt;

  await withRlsContext(user.id, user.role, (tx) =>
    tx
      .insert(lessonProgress)
      .values({ userId: user.id, lessonId, completedAt: completed ? new Date() : null })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: { completedAt: completed ? new Date() : null, lastAccessedAt: new Date() },
      }),
  );

  // Points/achievements are never reversed on an "un-complete" toggle —
  // only a genuine null-to-completed transition, the first time ever,
  // earns anything. Best-effort: a failure here must not undo the
  // progress write above, which is why it's a separate try/catch after
  // it, using the elevated `db` since points_ledger/user_achievements
  // have no policy for `authenticated` at all (system-only writes).
  if (isNewCompletion) {
    try {
      await awardPoints(db, user.id, POINTS.lessonCompleted, "lesson_completed", lessonId, "Completed a lesson");
      await checkAndAwardAchievements(db, user.id, "lesson");
    } catch (error) {
      logger.error({ err: error, userId: user.id, lessonId }, "gamification award failed after lesson completion");
    }
  }

  return { success: true, data: null };
}
