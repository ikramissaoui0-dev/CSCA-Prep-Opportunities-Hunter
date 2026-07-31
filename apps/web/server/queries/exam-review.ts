import "server-only";

import { eq, inArray } from "drizzle-orm";
import { examSessions, sessionAnswers, questions, questionOptions, explanations } from "@csca/db";
import type { UserRole } from "@csca/types";
import { db, withRlsContext } from "@/lib/db";

export type ReviewOption = { id: string; content: string; isCorrect: boolean };

export type ReviewQuestion = {
  questionId: string;
  type: "mcq" | "free_response";
  title: string;
  body: string;
  status: "correct" | "wrong" | "skipped";
  options: ReviewOption[];
  selectedOptionId: string | null;
  freeResponseText: string | null;
  correctAnswerText: string | null;
  cachedExplanation: string | null;
};

/**
 * Per-question review for a finished session — the one place the app
 * reveals is_correct/correctAnswerText to a student directly (everywhere
 * else, question_options_public hides it by design; see
 * 0002_content_schema.sql and 0009's fix). Safe here specifically because
 * the exam is already over: nothing left to leak that could change how
 * the student answers it.
 *
 * Goes through the elevated `db`, not withRlsContext — same trust
 * boundary as grading itself (0008_exam_engine_hardening.sql denies
 * authenticated direct reads of is_correct on session_answers/results by
 * design). The RLS-scoped ownership check below is what stands in for
 * RLS here, exactly like finalizeSession's `session.userId === user.id`.
 */
export async function getSessionReview(userId: string, role: UserRole, sessionId: string): Promise<ReviewQuestion[] | null> {
  const owned = await withRlsContext(userId, role, async (tx) => {
    const [session] = await tx.select({ id: examSessions.id, status: examSessions.status, questionOrder: examSessions.questionOrder }).from(examSessions).where(eq(examSessions.id, sessionId));
    return session ?? null;
  });

  if (!owned || (owned.status !== "submitted" && owned.status !== "expired")) {
    return null;
  }

  const questionIds = owned.questionOrder;
  if (questionIds.length === 0) return [];

  const [questionRows, optionRows, answerRows, explanationRows] = await Promise.all([
    db
      .select({ id: questions.id, type: questions.type, title: questions.title, body: questions.body, correctAnswerText: questions.correctAnswerText })
      .from(questions)
      .where(inArray(questions.id, questionIds)),
    db
      .select({ id: questionOptions.id, questionId: questionOptions.questionId, content: questionOptions.content, isCorrect: questionOptions.isCorrect, position: questionOptions.position })
      .from(questionOptions)
      .where(inArray(questionOptions.questionId, questionIds)),
    db
      .select({
        questionId: sessionAnswers.questionId,
        selectedOptionId: sessionAnswers.selectedOptionId,
        freeResponseText: sessionAnswers.freeResponseText,
        isCorrect: sessionAnswers.isCorrect,
      })
      .from(sessionAnswers)
      .where(eq(sessionAnswers.sessionId, sessionId)),
    db
      .select({ questionId: explanations.questionId, content: explanations.content })
      .from(explanations)
      .where(inArray(explanations.questionId, questionIds)),
  ]);

  const questionById = new Map(questionRows.map((q) => [q.id, q]));
  const optionsByQuestion = new Map<string, ReviewOption[]>();
  for (const opt of optionRows) {
    const list = optionsByQuestion.get(opt.questionId) ?? [];
    list.push({ id: opt.id, content: opt.content, isCorrect: opt.isCorrect });
    optionsByQuestion.set(opt.questionId, list);
  }
  const answerByQuestion = new Map(answerRows.map((a) => [a.questionId, a]));
  const explanationByQuestion = new Map(explanationRows.map((e) => [e.questionId, e.content]));

  return questionIds
    .map((id) => questionById.get(id))
    .filter((q): q is NonNullable<typeof q> => q !== undefined)
    .map((q) => {
      const answer = answerByQuestion.get(q.id);
      const status: ReviewQuestion["status"] = !answer ? "skipped" : answer.isCorrect ? "correct" : "wrong";

      return {
        questionId: q.id,
        type: q.type,
        title: q.title,
        body: q.body,
        status,
        options: optionsByQuestion.get(q.id) ?? [],
        selectedOptionId: answer?.selectedOptionId ?? null,
        freeResponseText: answer?.freeResponseText ?? null,
        correctAnswerText: q.correctAnswerText,
        cachedExplanation: explanationByQuestion.get(q.id) ?? null,
      };
    });
}
