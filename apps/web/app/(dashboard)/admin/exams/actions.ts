"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { createExamCore, updateExamCore, deleteExamCore, setExamPublishedCore } from "@/lib/admin/exams-actions-core";
import { listEligibleQuestions, type EligibleQuestionRow } from "@/server/queries/admin-exams";
import { examFormSchema, type ExamFormInput } from "@/lib/validation/exam-admin";

export async function createExam(input: ExamFormInput): Promise<ActionResult<{ examId: string }>> {
  const parsed = examFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await createExamCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/exams");
  return result;
}

export async function updateExam(input: ExamFormInput): Promise<ActionResult<{ examId: string }>> {
  const parsed = examFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await updateExamCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/exams");
  return result;
}

export async function deleteExam(examId: string): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await deleteExamCore(user, examId);
  if (result.success) revalidatePath("/admin/exams");
  return result;
}

export async function setExamPublished(examId: string, isPublished: boolean): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await setExamPublishedCore(user, examId, isPublished);
  if (result.success) revalidatePath("/admin/exams");
  return result;
}

export async function searchExamQuestions(input: { search?: string; subjectId?: string }): Promise<ActionResult<EligibleQuestionRow[]>> {
  const user = await requireRole("admin", "content_manager");
  const rows = await listEligibleQuestions(user.id, user.role, input);
  return { success: true, data: rows };
}
