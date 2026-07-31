"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { startExamCore, saveAnswerCore, submitExamCore, logTabSwitchCore } from "@/lib/exam/actions-core";
import { startExamSchema, saveAnswerSchema, type StartExamInput, type SaveAnswerInput } from "@/lib/validation/exam";
import { explainQuestionCore } from "@/lib/ai/explain-question";
import { explainQuestionSchema, type ExplainQuestionInput } from "@/lib/validation/ai";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Thin client-callable boundary: authenticate, validate the untrusted
 * input, delegate to the core logic (lib/exam/actions-core.ts), then
 * redirect() based on the result. Kept separate from the core so the
 * actual business logic can be exercised without a Next.js request
 * context — see lib/exam/actions-core.ts's docstring.
 */
export async function startExam(input: StartExamInput): Promise<ActionResult<never> | undefined> {
  const parsed = startExamSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireUser();
  const rateLimit = await checkRateLimit("exam-start", user.id, { requests: 20, windowSeconds: 600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many exams started. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }
  const result = await startExamCore(user, parsed.data);
  if (!result.success) {
    return result;
  }
  redirect(`/exam/${result.data.sessionId}`);
}

export async function saveAnswer(input: SaveAnswerInput): Promise<ActionResult<null>> {
  const parsed = saveAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireUser();
  // Generous — a normal exam-taking pace autosaves on nearly every
  // click, so this only ever catches a genuinely automated loop, not a
  // fast test-taker.
  const rateLimit = await checkRateLimit("exam-save-answer", user.id, { requests: 120, windowSeconds: 300 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED"));
  }
  return saveAnswerCore(user, parsed.data);
}

export async function submitExam(sessionId: string): Promise<ActionResult<never> | undefined> {
  const user = await requireUser();
  const rateLimit = await checkRateLimit("exam-submit", user.id, { requests: 10, windowSeconds: 300 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many submissions. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }
  const result = await submitExamCore(user, sessionId);
  if (!result.success) {
    return result;
  }
  redirect(`/exam/${result.data.sessionId}/results`);
}

export async function logTabSwitch(sessionId: string): Promise<void> {
  const user = await requireUser();
  await logTabSwitchCore(user, sessionId);
}

export async function explainQuestion(input: ExplainQuestionInput): Promise<ActionResult<{ content: string }>> {
  const parsed = explainQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireUser();
  // Cost control (Phase 7/9's "cost-bounded AI usage") — cache hits
  // (the common case) don't call OpenAI at all, but this still bounds
  // how many genuinely new explanations one user can trigger per hour.
  const rateLimit = await checkRateLimit("ai-explain", user.id, { requests: 30, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many explanation requests. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }
  return explainQuestionCore(user, parsed.data);
}
