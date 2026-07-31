import "server-only";

import { eq, inArray } from "drizzle-orm";
import { examSessions, sessionAnswers, questions, questionOptionsPublicView } from "@csca/db";
import type { UserRole } from "@csca/types";
import { db, withRlsContext } from "@/lib/db";
import { finalizeSession } from "@/lib/exam/finalize";
import { isPastDeadline } from "@/lib/exam/timing";

export type ExamTakingQuestion = {
  id: string;
  type: "mcq" | "free_response";
  title: string;
  body: string;
  imageUrl: string | null;
  options: { id: string; content: string; position: number }[];
};

export type ExamTakingAnswer = { selectedOptionId?: string; freeResponseText?: string };

export type ExamTakingSession = {
  id: string;
  mode: string;
  status: string;
  startedAt: Date;
  timeLimitSeconds: number | null;
  tabSwitchCount: number;
  questions: ExamTakingQuestion[];
  answers: Record<string, ExamTakingAnswer>;
};

async function readSession(userId: string, role: UserRole, sessionId: string) {
  return withRlsContext(userId, role, async (tx) => {
    const [session] = await tx.select().from(examSessions).where(eq(examSessions.id, sessionId));
    return session ?? null;
  });
}

/**
 * Returns everything the exam-taking page needs, or null if the session
 * doesn't exist or belong to this user. Reads go through the RLS-scoped
 * connection (defense in depth, matching Phase 3's dashboard queries);
 * the lazy-expiry finalize — if the deadline has already passed — uses
 * the elevated connection, the only one exam_sessions writes ever go
 * through (0008_exam_engine_hardening.sql).
 */
export async function getExamSessionForTaking(
  userId: string,
  role: UserRole,
  sessionId: string,
): Promise<ExamTakingSession | null> {
  let session = await readSession(userId, role, sessionId);
  if (!session || session.userId !== userId) return null;

  if (session.status === "in_progress" && isPastDeadline(session.startedAt, session.timeLimitSeconds)) {
    await finalizeSession(db, sessionId, "expired");
    session = await readSession(userId, role, sessionId);
    if (!session) return null;
  }

  const questionIds = session.questionOrder;

  const [questionRows, optionRows, answerRows] = await withRlsContext(userId, role, async (tx) => {
    return Promise.all([
      questionIds.length > 0
        ? tx
            .select({ id: questions.id, type: questions.type, title: questions.title, body: questions.body, imageUrl: questions.imageUrl })
            .from(questions)
            .where(inArray(questions.id, questionIds))
        : Promise.resolve([]),
      questionIds.length > 0
        ? tx
            .select({
              id: questionOptionsPublicView.id,
              questionId: questionOptionsPublicView.questionId,
              content: questionOptionsPublicView.content,
              position: questionOptionsPublicView.position,
            })
            .from(questionOptionsPublicView)
            .where(inArray(questionOptionsPublicView.questionId, questionIds))
        : Promise.resolve([]),
      tx
        .select({
          questionId: sessionAnswers.questionId,
          selectedOptionId: sessionAnswers.selectedOptionId,
          freeResponseText: sessionAnswers.freeResponseText,
        })
        .from(sessionAnswers)
        .where(eq(sessionAnswers.sessionId, sessionId)),
    ]);
  });

  const questionById = new Map(questionRows.map((q) => [q.id, q]));
  const optionsByQuestion = new Map<string, ExamTakingQuestion["options"]>();
  for (const opt of optionRows) {
    const list = optionsByQuestion.get(opt.questionId) ?? [];
    list.push({ id: opt.id, content: opt.content, position: opt.position });
    optionsByQuestion.set(opt.questionId, list);
  }

  const orderedQuestions: ExamTakingQuestion[] = questionIds
    .map((id) => questionById.get(id))
    .filter((q): q is NonNullable<typeof q> => q !== undefined)
    .map((q) => ({
      id: q.id,
      type: q.type,
      title: q.title,
      body: q.body,
      imageUrl: q.imageUrl,
      options: (optionsByQuestion.get(q.id) ?? []).sort((a, b) => a.position - b.position),
    }));

  const answers: Record<string, ExamTakingAnswer> = Object.fromEntries(
    answerRows.map((a) => [
      a.questionId,
      { selectedOptionId: a.selectedOptionId ?? undefined, freeResponseText: a.freeResponseText ?? undefined },
    ]),
  );

  return {
    id: session.id,
    mode: session.mode,
    status: session.status,
    startedAt: session.startedAt,
    timeLimitSeconds: session.timeLimitSeconds,
    tabSwitchCount: session.tabSwitchCount,
    questions: orderedQuestions,
    answers,
  };
}
