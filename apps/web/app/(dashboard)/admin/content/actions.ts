"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import {
  createQuestionCore,
  updateQuestionCore,
  deleteQuestionCore,
  setQuestionPublishedCore,
  commitBulkImportCore,
} from "@/lib/question-bank/actions-core";
import { questionFormSchema, importRowSchema, type QuestionFormInput, type ImportRow } from "@/lib/validation/question";
import { parseImportFile, type ImportRowResult } from "@/lib/question-import";

export async function createQuestion(input: QuestionFormInput): Promise<ActionResult<{ questionId: string }>> {
  const parsed = questionFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await createQuestionCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/content");
  return result;
}

export async function updateQuestion(input: QuestionFormInput): Promise<ActionResult<{ questionId: string }>> {
  const parsed = questionFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await updateQuestionCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/content");
  return result;
}

export async function deleteQuestion(questionId: string): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await deleteQuestionCore(user, questionId);
  if (result.success) revalidatePath("/admin/content");
  return result;
}

export async function setQuestionPublished(questionId: string, isPublished: boolean): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await setQuestionPublishedCore(user, questionId, isPublished);
  if (result.success) revalidatePath("/admin/content");
  return result;
}

const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024; // 5MB — plenty for a few hundred rows, rejects anything pathological

export async function previewBulkImport(formData: FormData): Promise<ActionResult<ImportRowResult[]>> {
  await requireRole("admin", "content_manager");

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Choose a .csv or .xlsx file"));
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    return actionFailure(new AppError("VALIDATION_ERROR", "File is too large (max 5MB)"));
  }
  if (!file.name.toLowerCase().endsWith(".csv") && !file.name.toLowerCase().endsWith(".xlsx")) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Only .csv or .xlsx files are supported"));
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const results = await parseImportFile({ name: file.name, buffer });
  return { success: true, data: results };
}

export async function commitBulkImport(rows: ImportRow[]): Promise<ActionResult<{ created: number }>> {
  // Re-validate server-side — never trust that a client round-trip of
  // "rows I previously told you were valid" wasn't tampered with.
  const parsedRows: ImportRow[] = [];
  for (const row of rows) {
    const parsed = importRowSchema.safeParse(row);
    if (!parsed.success) {
      return actionFailure(new AppError("VALIDATION_ERROR", "One or more rows failed validation on re-check."));
    }
    parsedRows.push(parsed.data);
  }

  const user = await requireRole("admin", "content_manager");
  const result = await commitBulkImportCore(user, parsedRows);
  if (result.success) revalidatePath("/admin/content");
  return result;
}
