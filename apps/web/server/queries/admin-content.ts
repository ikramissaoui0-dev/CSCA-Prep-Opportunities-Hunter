import "server-only";

import { eq, and, ilike, or, sql, desc, type SQL } from "drizzle-orm";
import { questions, questionCategories, subjects, questionOptions } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type QuestionListFilters = {
  search?: string;
  subjectId?: string;
  categoryId?: string;
  isPublished?: "all" | "published" | "draft";
  page: number;
  pageSize: number;
};

export type QuestionListRow = {
  id: string;
  title: string;
  difficulty: number;
  isPublished: boolean;
  subjectName: string;
  categoryName: string;
  optionCount: number;
  createdAt: Date;
};

export async function listQuestions(
  userId: string,
  role: UserRole,
  filters: QuestionListFilters,
): Promise<{ rows: QuestionListRow[]; total: number }> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      const pattern = `%${filters.search}%`;
      conditions.push(or(ilike(questions.title, pattern), ilike(questions.body, pattern))!);
    }
    if (filters.subjectId) {
      conditions.push(eq(subjects.id, filters.subjectId));
    }
    if (filters.categoryId) {
      conditions.push(eq(questions.categoryId, filters.categoryId));
    }
    if (filters.isPublished === "published") {
      conditions.push(eq(questions.isPublished, true));
    } else if (filters.isPublished === "draft") {
      conditions.push(eq(questions.isPublished, false));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ count }]] = await Promise.all([
      tx
        .select({
          id: questions.id,
          title: questions.title,
          difficulty: questions.difficulty,
          isPublished: questions.isPublished,
          subjectName: subjects.name,
          categoryName: questionCategories.name,
          createdAt: questions.createdAt,
          optionCount: sql<number>`(select count(*)::int from question_options where question_options.question_id = ${questions.id})`,
        })
        .from(questions)
        .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
        .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
        .where(where)
        .orderBy(desc(questions.createdAt))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(questions)
        .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
        .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
        .where(where),
    ]);

    return { rows, total: count };
  });
}

export type QuestionForEdit = {
  id: string;
  title: string;
  body: string;
  categoryId: string;
  difficulty: number;
  imageUrl: string | null;
  attachments: { url: string; name: string }[];
  authorExplanation: string | null;
  isPublished: boolean;
  options: { id: string; content: string; isCorrect: boolean; position: number }[];
};

export async function getQuestionForEdit(userId: string, role: UserRole, questionId: string): Promise<QuestionForEdit | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [question] = await tx.select().from(questions).where(eq(questions.id, questionId));
    if (!question) return null;

    const options = await tx
      .select({ id: questionOptions.id, content: questionOptions.content, isCorrect: questionOptions.isCorrect, position: questionOptions.position })
      .from(questionOptions)
      .where(eq(questionOptions.questionId, questionId))
      .orderBy(questionOptions.position);

    return {
      id: question.id,
      title: question.title,
      body: question.body,
      categoryId: question.categoryId,
      difficulty: question.difficulty,
      imageUrl: question.imageUrl,
      attachments: question.attachments as { url: string; name: string }[],
      authorExplanation: question.authorExplanation,
      isPublished: question.isPublished,
      options,
    };
  });
}

export type TaxonomySubject = {
  id: string;
  name: string;
  categories: { id: string; name: string }[];
};

export async function listTaxonomy(userId: string, role: UserRole): Promise<TaxonomySubject[]> {
  return withRlsContext(userId, role, async (tx) => {
    const rows = await tx
      .select({
        subjectId: subjects.id,
        subjectName: subjects.name,
        categoryId: questionCategories.id,
        categoryName: questionCategories.name,
      })
      .from(subjects)
      .leftJoin(questionCategories, eq(questionCategories.subjectId, subjects.id))
      .orderBy(subjects.displayOrder, questionCategories.displayOrder);

    const bySubject = new Map<string, TaxonomySubject>();
    for (const row of rows) {
      const entry = bySubject.get(row.subjectId) ?? { id: row.subjectId, name: row.subjectName, categories: [] };
      if (row.categoryId && row.categoryName) {
        entry.categories.push({ id: row.categoryId, name: row.categoryName });
      }
      bySubject.set(row.subjectId, entry);
    }
    return [...bySubject.values()];
  });
}
