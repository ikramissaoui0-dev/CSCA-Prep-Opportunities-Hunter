import "server-only";

import { eq, and, ilike, sql } from "drizzle-orm";
import { questions, questionOptions, sessionAnswers, subjects, questionCategories } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { withRlsContext } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { slugify } from "@/lib/slug";
import type { QuestionFormInput } from "@/lib/validation/question";
import type { ImportRow } from "@/lib/validation/question";

function isForeignKeyViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "23503";
}

export async function createQuestionCore(user: SessionUser, input: QuestionFormInput): Promise<ActionResult<{ questionId: string }>> {
  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const [created] = await tx
        .insert(questions)
        .values({
          categoryId: input.categoryId,
          type: "mcq",
          difficulty: input.difficulty,
          title: input.title,
          body: input.body,
          imageUrl: input.imageUrl || null,
          attachments: input.attachments,
          authorExplanation: input.authorExplanation || null,
          isPublished: input.isPublished,
          createdBy: user.id,
        })
        .returning({ id: questions.id });

      const questionId = created!.id;
      for (let i = 0; i < input.options.length; i++) {
        const opt = input.options[i]!;
        await tx.insert(questionOptions).values({ questionId, content: opt.content, isCorrect: opt.isCorrect, position: i + 1 });
      }
      return { questionId };
    });
    return { success: true, data: result };
  } catch (error) {
    return actionFailure(error);
  }
}

/**
 * Options already selected by a student (session_answers references
 * them) can never be deleted — the FK is `on delete restrict` — so a
 * removed option is checked and rejected with a clear message *before*
 * the delete is attempted, rather than surfacing a raw DB error.
 * Existing options are updated in place (never delete+recreate) so
 * their ids, and any historical answers pointing at them, stay valid.
 */
export async function updateQuestionCore(user: SessionUser, input: QuestionFormInput): Promise<ActionResult<{ questionId: string }>> {
  if (!input.id) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Missing question id"));
  }
  const questionId = input.id;

  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const [existing] = await tx.select({ id: questions.id }).from(questions).where(eq(questions.id, questionId));
      if (!existing) {
        throw new AppError("NOT_FOUND", "Question not found");
      }

      await tx
        .update(questions)
        .set({
          title: input.title,
          body: input.body,
          categoryId: input.categoryId,
          difficulty: input.difficulty,
          imageUrl: input.imageUrl || null,
          attachments: input.attachments,
          authorExplanation: input.authorExplanation || null,
          isPublished: input.isPublished,
          updatedAt: new Date(),
        })
        .where(eq(questions.id, questionId));

      const existingOptions = await tx.select({ id: questionOptions.id }).from(questionOptions).where(eq(questionOptions.questionId, questionId));
      const existingIds = new Set(existingOptions.map((o) => o.id));
      const submittedIds = new Set(input.options.filter((o) => o.id).map((o) => o.id!));
      const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));

      for (const optionId of toDelete) {
        const [{ count }] = await tx
          .select({ count: sql<number>`count(*)::int` })
          .from(sessionAnswers)
          .where(eq(sessionAnswers.selectedOptionId, optionId));
        if (count > 0) {
          throw new AppError(
            "VALIDATION_ERROR",
            "Can't remove an option students have already selected — edit its text instead, or leave it and mark a different option correct.",
          );
        }
        await tx.delete(questionOptions).where(eq(questionOptions.id, optionId));
      }

      for (let i = 0; i < input.options.length; i++) {
        const opt = input.options[i]!;
        if (opt.id) {
          await tx.update(questionOptions).set({ content: opt.content, isCorrect: opt.isCorrect, position: i + 1 }).where(eq(questionOptions.id, opt.id));
        } else {
          await tx.insert(questionOptions).values({ questionId, content: opt.content, isCorrect: opt.isCorrect, position: i + 1 });
        }
      }

      return { questionId };
    });
    return { success: true, data: result };
  } catch (error) {
    return actionFailure(error);
  }
}

/**
 * Relies on the database's own FK constraints (exam_questions and
 * session_answers both reference questions `on delete restrict`) rather
 * than a separate "is this question in use" query — Postgres already
 * knows the answer authoritatively; this just gives the violation a
 * readable message instead of a raw error code.
 */
export async function deleteQuestionCore(user: SessionUser, questionId: string): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, (tx) => tx.delete(questions).where(eq(questions.id, questionId)));
    return { success: true, data: null };
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return actionFailure(new AppError("VALIDATION_ERROR", "This question has been used in an exam and can't be deleted — unpublish it instead."));
    }
    return actionFailure(error);
  }
}

export async function setQuestionPublishedCore(user: SessionUser, questionId: string, isPublished: boolean): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, async (tx) => {
      if (isPublished) {
        const options = await tx.select({ isCorrect: questionOptions.isCorrect }).from(questionOptions).where(eq(questionOptions.questionId, questionId));
        if (options.length < 2) {
          throw new AppError("VALIDATION_ERROR", "Add at least 2 options before publishing.");
        }
        if (!options.some((o) => o.isCorrect)) {
          throw new AppError("VALIDATION_ERROR", "Mark a correct option before publishing.");
        }
      }
      await tx.update(questions).set({ isPublished, updatedAt: new Date() }).where(eq(questions.id, questionId));
    });
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}

/**
 * Imported questions are always created unpublished — a content_manager
 * should review AI/spreadsheet-sourced content before it can appear in
 * a live exam, the same bar as a hand-authored draft.
 */
export async function commitBulkImportCore(user: SessionUser, rows: ImportRow[]): Promise<ActionResult<{ created: number }>> {
  try {
    const created = await withRlsContext(user.id, user.role, async (tx) => {
      let count = 0;
      for (const row of rows) {
        let [subject] = await tx.select({ id: subjects.id }).from(subjects).where(ilike(subjects.name, row.subject));
        if (!subject) {
          [subject] = await tx.insert(subjects).values({ name: row.subject, slug: slugify(row.subject) }).returning({ id: subjects.id });
        }

        let [category] = await tx
          .select({ id: questionCategories.id })
          .from(questionCategories)
          .where(and(eq(questionCategories.subjectId, subject!.id), ilike(questionCategories.name, row.topic)));
        if (!category) {
          [category] = await tx
            .insert(questionCategories)
            .values({ subjectId: subject!.id, name: row.topic, slug: slugify(row.topic) })
            .returning({ id: questionCategories.id });
        }

        const [createdQuestion] = await tx
          .insert(questions)
          .values({
            categoryId: category!.id,
            type: "mcq",
            difficulty: row.difficulty,
            title: row.title,
            body: row.body,
            imageUrl: row.imageUrl || null,
            authorExplanation: row.explanation || null,
            isPublished: false,
            createdBy: user.id,
          })
          .returning({ id: questions.id });

        const optionTexts = [row.option1, row.option2, row.option3, row.option4].filter((o) => o.length > 0);
        for (let i = 0; i < optionTexts.length; i++) {
          await tx.insert(questionOptions).values({
            questionId: createdQuestion!.id,
            content: optionTexts[i]!,
            isCorrect: i + 1 === row.correctOption,
            position: i + 1,
          });
        }
        count++;
      }
      return count;
    });
    return { success: true, data: { created } };
  } catch (error) {
    return actionFailure(error);
  }
}
