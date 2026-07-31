import "server-only";

import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { sessionAnswers, questions, type Database } from "@csca/db";
import { logger } from "@/lib/logger";
import { openaiClient, type AiClient } from "./client";

/**
 * Grades every still-ungraded free-response answer in a session, updating
 * session_answers.is_correct in place. Must run and commit BEFORE
 * finalizeSession's transaction opens (see lib/exam/finalize.ts) — grading
 * calls an external API, which has no business happening inside a
 * row-locked DB transaction.
 *
 * Deliberately never throws: a single student's exam submission must not
 * fail because the AI grader is down. A grading failure leaves is_correct
 * null, and finalizeSession's tally already treats a null the same as
 * "wrong" (an answer exists — it's not skipped — but isn't confirmed
 * correct), which is the safe default to fail toward.
 */
export async function gradeFreeResponseAnswers(db: Database, sessionId: string, client: AiClient = openaiClient): Promise<void> {
  const ungraded = await db
    .select({
      answerId: sessionAnswers.id,
      questionId: sessionAnswers.questionId,
      freeResponseText: sessionAnswers.freeResponseText,
      title: questions.title,
      body: questions.body,
      correctAnswerText: questions.correctAnswerText,
    })
    .from(sessionAnswers)
    .innerJoin(questions, eq(questions.id, sessionAnswers.questionId))
    .where(and(eq(sessionAnswers.sessionId, sessionId), isNotNull(sessionAnswers.freeResponseText), isNull(sessionAnswers.isCorrect)));

  for (const answer of ungraded) {
    if (!answer.correctAnswerText || !answer.freeResponseText) continue;

    try {
      const isCorrect = await client.gradeFreeResponse({
        title: answer.title,
        body: answer.body,
        correctAnswerText: answer.correctAnswerText,
        studentAnswer: answer.freeResponseText,
      });
      await db.update(sessionAnswers).set({ isCorrect }).where(eq(sessionAnswers.id, answer.answerId));
    } catch (error) {
      logger.error({ err: error, sessionId, questionId: answer.questionId }, "AI grading failed for free-response answer");
    }
  }
}
