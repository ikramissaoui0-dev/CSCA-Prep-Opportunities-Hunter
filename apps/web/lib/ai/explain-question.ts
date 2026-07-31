import "server-only";

import { eq, and } from "drizzle-orm";
import { examSessions, sessionAnswers, questions, questionOptions, explanations } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import type { ExplainQuestionInput } from "@/lib/validation/ai";
import { getCurrentPlanTier, planTierAtLeast } from "@/lib/billing/plan";
import { openaiClient, AI_MODEL_VERSION, type AiClient } from "./client";

const EXPLANATION_LANGUAGE = "en";

/**
 * Cache-first: an explanation is generated once per question (shared
 * across every student who ever gets it wrong) and reused forever after,
 * which is what keeps this affordable at 100k+ students — the alternative
 * of generating one per student per attempt would multiply cost by
 * enrollment for no benefit, since the explanation for a fixed question
 * doesn't depend on who's asking.
 *
 * Authorization is intentionally narrow: a student may only request an
 * explanation for a question they actually attempted, in one of their own
 * *finalized* sessions — this endpoint is a tutor, not a generic "look up
 * any question's answer" oracle, even though the underlying cache table
 * has no per-user ownership of its own.
 */
export async function explainQuestionCore(
  user: SessionUser,
  input: ExplainQuestionInput,
  client: AiClient = openaiClient,
): Promise<ActionResult<{ content: string }>> {
  const { sessionId, questionId } = input;

  const [session] = await db.select({ id: examSessions.id, userId: examSessions.userId, status: examSessions.status }).from(examSessions).where(eq(examSessions.id, sessionId));
  if (!session || session.userId !== user.id) {
    return actionFailure(new AppError("FORBIDDEN"));
  }
  if (session.status !== "submitted" && session.status !== "expired") {
    return actionFailure(new AppError("VALIDATION_ERROR", "This exam hasn't been submitted yet."));
  }

  // AI explanations are a Premium feature (Phase 9's plan matrix) — gated
  // here rather than only in the UI, since this is a Server Action anyone
  // could otherwise call directly regardless of what the button shows.
  const planTier = await getCurrentPlanTier(user.id, user.role);
  if (!planTierAtLeast(planTier, "premium")) {
    return actionFailure(new AppError("FORBIDDEN", "AI explanations are a Premium feature — upgrade to unlock them."));
  }

  const [answer] = await db
    .select({ id: sessionAnswers.id })
    .from(sessionAnswers)
    .where(and(eq(sessionAnswers.sessionId, sessionId), eq(sessionAnswers.questionId, questionId)));
  if (!answer) {
    return actionFailure(new AppError("FORBIDDEN", "You didn't attempt this question in this session."));
  }

  const [cached] = await db
    .select({ content: explanations.content })
    .from(explanations)
    .where(and(eq(explanations.questionId, questionId), eq(explanations.language, EXPLANATION_LANGUAGE)));
  if (cached) {
    return { success: true, data: { content: cached.content } };
  }

  const [question] = await db
    .select({ title: questions.title, body: questions.body, correctAnswerText: questions.correctAnswerText })
    .from(questions)
    .where(eq(questions.id, questionId));
  if (!question) {
    return actionFailure(new AppError("NOT_FOUND"));
  }

  const optionRows = await db
    .select({ content: questionOptions.content, isCorrect: questionOptions.isCorrect })
    .from(questionOptions)
    .where(eq(questionOptions.questionId, questionId));

  let content: string;
  try {
    content = await client.explainQuestion({
      title: question.title,
      body: question.body,
      options: optionRows,
      correctAnswerText: question.correctAnswerText,
    });
  } catch (error) {
    return actionFailure(new AppError("PROVIDER_ERROR", undefined, { cause: error }));
  }

  if (!content) {
    return actionFailure(new AppError("PROVIDER_ERROR"));
  }

  // onConflictDoNothing: two students can race to generate the same
  // question's explanation for the first time; whichever insert commits
  // first wins; the loser's (identical-purpose) generation is simply
  // discarded rather than erroring or double-writing.
  await db
    .insert(explanations)
    .values({ questionId, language: EXPLANATION_LANGUAGE, content, modelVersion: AI_MODEL_VERSION })
    .onConflictDoNothing({ target: [explanations.questionId, explanations.language] });

  const [finalRow] = await db
    .select({ content: explanations.content })
    .from(explanations)
    .where(and(eq(explanations.questionId, questionId), eq(explanations.language, EXPLANATION_LANGUAGE)));

  return { success: true, data: { content: finalRow?.content ?? content } };
}
