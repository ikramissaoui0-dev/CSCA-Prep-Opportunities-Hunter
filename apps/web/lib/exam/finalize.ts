import "server-only";

import { eq, inArray, sql } from "drizzle-orm";
import {
  examSessions,
  sessionAnswers,
  questions,
  questionCategories,
  examResults,
  topicMastery,
  type Database,
} from "@csca/db";
import { computeTimeSpentSeconds } from "./timing";
import { gradeFreeResponseAnswers } from "@/lib/ai/grade-free-response";
import { awardPoints, POINTS, type PointsSourceType } from "@/lib/gamification/points";
import { checkAndAwardAchievements } from "@/lib/gamification/achievements";
import { logger } from "@/lib/logger";

// Exponential-moving-average learning rate for topic_mastery updates — a
// simple v1 heuristic (docs/ARCHITECTURE.md: "deliberately not a custom
// ML model for v1"), not a tuned model. Each submitted session nudges a
// category's mastery_score 20% of the way toward that session's
// accuracy in the category.
const MASTERY_EMA_ALPHA = 0.2;

export type FinalizeReason = "submitted" | "expired";

/**
 * Scores a session, writes exam_results, and nudges topic_mastery — the
 * one place both a user-initiated submit and the lazy-expiry sweep (see
 * ensureSessionCurrent in actions.ts) funnel through, so there is exactly
 * one scoring implementation. Idempotent: finalizing an already-finalized
 * session is a no-op and returns null.
 *
 * Must be called with the elevated `db` (lib/db.ts), never an
 * RLS-scoped connection — exam_sessions/session_answers/exam_results/
 * topic_mastery all deny direct authenticated writes by design (see
 * 0008_exam_engine_hardening.sql), so grading only ever happens here.
 */
export async function finalizeSession(db: Database, sessionId: string, reason: FinalizeReason): Promise<{ resultId: string } | null> {
  // Runs and commits before the transaction below opens: it calls an
  // external AI API, which must never happen while holding the session's
  // row lock. By the time the transaction reads session_answers, any
  // free-response answers are already graded (or left null on failure).
  await gradeFreeResponseAnswers(db, sessionId);

  const outcome = await db.transaction(async (tx) => {
    const [session] = await tx.select().from(examSessions).where(eq(examSessions.id, sessionId)).for("update");

    if (!session || session.status !== "in_progress") {
      return null;
    }

    const questionIds = session.questionOrder;

    const answers = await tx
      .select({
        questionId: sessionAnswers.questionId,
        isCorrect: sessionAnswers.isCorrect,
      })
      .from(sessionAnswers)
      .where(eq(sessionAnswers.sessionId, sessionId));
    const answerByQuestion = new Map(answers.map((a) => [a.questionId, a]));

    const questionMeta =
      questionIds.length > 0
        ? await tx
            .select({
              questionId: questions.id,
              categoryId: questions.categoryId,
              subjectId: questionCategories.subjectId,
            })
            .from(questions)
            .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
            .where(inArray(questions.id, questionIds))
        : [];
    const metaByQuestion = new Map(questionMeta.map((m) => [m.questionId, m]));

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const categoryTally = new Map<string, { correct: number; total: number }>();
    const subjectTally = new Map<string, { correct: number; total: number }>();

    for (const questionId of questionIds) {
      const meta = metaByQuestion.get(questionId);
      const answer = answerByQuestion.get(questionId);

      if (!answer) {
        skippedCount++;
      } else if (answer.isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      if (meta) {
        const isCorrect = answer?.isCorrect ?? false;
        const wasAnswered = answer !== undefined;

        if (wasAnswered) {
          const cat = categoryTally.get(meta.categoryId) ?? { correct: 0, total: 0 };
          cat.total += 1;
          if (isCorrect) cat.correct += 1;
          categoryTally.set(meta.categoryId, cat);
        }

        const subj = subjectTally.get(meta.subjectId) ?? { correct: 0, total: 0 };
        subj.total += 1;
        if (wasAnswered && isCorrect) subj.correct += 1;
        subjectTally.set(meta.subjectId, subj);
      }
    }

    const totalQuestions = questionIds.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 10000) / 100 : 0;
    const timeSpentSeconds = computeTimeSpentSeconds(session.startedAt, session.timeLimitSeconds);

    const subjectBreakdown = Object.fromEntries(
      [...subjectTally.entries()].map(([subjectId, tally]) => [
        subjectId,
        { correct: tally.correct, total: tally.total, percentage: tally.total > 0 ? Math.round((tally.correct / tally.total) * 10000) / 100 : 0 },
      ]),
    );

    await tx
      .update(examSessions)
      .set({ status: reason, submittedAt: new Date(), score: percentage, updatedAt: new Date() })
      .where(eq(examSessions.id, sessionId));

    const [result] = await tx
      .insert(examResults)
      .values({
        sessionId,
        totalQuestions,
        correctCount,
        wrongCount,
        skippedCount,
        score: percentage,
        percentage,
        timeSpentSeconds,
        subjectBreakdown,
      })
      .returning({ id: examResults.id });

    for (const [categoryId, tally] of categoryTally) {
      const accuracy = tally.total > 0 ? tally.correct / tally.total : 0;
      await tx
        .insert(topicMastery)
        .values({
          userId: session.userId,
          categoryId,
          masteryScore: accuracy,
          questionsAttempted: tally.total,
          questionsCorrect: tally.correct,
        })
        .onConflictDoUpdate({
          target: [topicMastery.userId, topicMastery.categoryId],
          set: {
            masteryScore: sql`${topicMastery.masteryScore} + ${MASTERY_EMA_ALPHA} * (${accuracy} - ${topicMastery.masteryScore})`,
            questionsAttempted: sql`${topicMastery.questionsAttempted} + ${tally.total}`,
            questionsCorrect: sql`${topicMastery.questionsCorrect} + ${tally.correct}`,
            updatedAt: new Date(),
          },
        });
    }

    return result ? { resultId: result.id, userId: session.userId, mode: session.mode } : null;
  });

  if (!outcome) return null;

  // Outside the transaction above, on purpose: gamification is a
  // best-effort side effect (same principle as the AI recommendation
  // batch in actions-core.ts) — a bug in a points/achievement rule must
  // never roll back a student's just-computed exam score.
  try {
    const isDailyChallenge = outcome.mode === "daily_challenge";
    const points = isDailyChallenge ? POINTS.dailyChallenge : POINTS.examCompleted;
    const sourceType: PointsSourceType = isDailyChallenge ? "daily_challenge" : "exam_completed";
    await awardPoints(db, outcome.userId, points, sourceType, sessionId, `Completed a ${outcome.mode.replace("_", " ")} session`);
    await checkAndAwardAchievements(db, outcome.userId, "exam");
  } catch (error) {
    logger.error({ err: error, sessionId, userId: outcome.userId }, "gamification award failed after exam finalize");
  }

  return { resultId: outcome.resultId };
}
