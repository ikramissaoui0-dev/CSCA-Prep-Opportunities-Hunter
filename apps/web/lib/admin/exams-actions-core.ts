import "server-only";

import { eq, sql } from "drizzle-orm";
import { exams, examQuestions, type Database } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { withRlsContext } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import type { ExamFormInput } from "@/lib/validation/exam-admin";

function pgErrorCode(error: unknown): string | undefined {
  return typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined;
}

function toExamValues(input: ExamFormInput) {
  return {
    title: input.title,
    description: input.description || null,
    mode: input.mode,
    timeLimitSeconds: input.timeLimitMinutes * 60,
    challengeDate: input.mode === "daily_challenge" ? input.challengeDate : null,
    isPublished: input.isPublished,
  };
}

async function replaceExamQuestions(tx: Database, examId: string, questionIds: string[]) {
  await tx.delete(examQuestions).where(eq(examQuestions.examId, examId));
  for (let i = 0; i < questionIds.length; i++) {
    await tx.insert(examQuestions).values({ examId, questionId: questionIds[i]!, position: i + 1 });
  }
}

export async function createExamCore(user: SessionUser, input: ExamFormInput): Promise<ActionResult<{ examId: string }>> {
  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const [created] = await tx
        .insert(exams)
        .values({ ...toExamValues(input), createdBy: user.id })
        .returning({ id: exams.id });
      const examId = created!.id;
      await replaceExamQuestions(tx, examId, input.questionIds);
      return { examId };
    });
    return { success: true, data: result };
  } catch (error) {
    if (pgErrorCode(error) === "23505") {
      return actionFailure(new AppError("VALIDATION_ERROR", "Another daily challenge is already scheduled for that date."));
    }
    return actionFailure(error);
  }
}

export async function updateExamCore(user: SessionUser, input: ExamFormInput): Promise<ActionResult<{ examId: string }>> {
  if (!input.id) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Missing exam id"));
  }
  const examId = input.id;

  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const [existing] = await tx.select({ id: exams.id }).from(exams).where(eq(exams.id, examId));
      if (!existing) {
        throw new AppError("NOT_FOUND", "Exam not found");
      }

      await tx.update(exams).set({ ...toExamValues(input), updatedAt: new Date() }).where(eq(exams.id, examId));
      await replaceExamQuestions(tx, examId, input.questionIds);
      return { examId };
    });
    return { success: true, data: result };
  } catch (error) {
    if (pgErrorCode(error) === "23505") {
      return actionFailure(new AppError("VALIDATION_ERROR", "Another daily challenge is already scheduled for that date."));
    }
    return actionFailure(error);
  }
}

/**
 * exam_sessions references exams `on delete restrict` — once a single
 * student has started this exam, Postgres refuses the delete outright
 * rather than orphaning their history. Caught here and turned into a
 * clear message instead of a raw FK error.
 */
export async function deleteExamCore(user: SessionUser, examId: string): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, (tx) => tx.delete(exams).where(eq(exams.id, examId)));
    return { success: true, data: null };
  } catch (error) {
    if (pgErrorCode(error) === "23503") {
      return actionFailure(new AppError("VALIDATION_ERROR", "This exam has already been taken by students and can't be deleted — unpublish it instead."));
    }
    return actionFailure(error);
  }
}

export async function setExamPublishedCore(user: SessionUser, examId: string, isPublished: boolean): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, async (tx) => {
      if (isPublished) {
        const [{ count }] = await tx
          .select({ count: sql<number>`count(*)::int` })
          .from(examQuestions)
          .where(eq(examQuestions.examId, examId));
        if (count === 0) {
          throw new AppError("VALIDATION_ERROR", "Add at least one question before publishing.");
        }
      }
      await tx.update(exams).set({ isPublished, updatedAt: new Date() }).where(eq(exams.id, examId));
    });
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}
