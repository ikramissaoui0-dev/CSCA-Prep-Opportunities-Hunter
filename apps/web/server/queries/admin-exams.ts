import "server-only";

import { eq, and, or, ilike, isNotNull, sql, desc, type SQL } from "drizzle-orm";
import { exams, examQuestions, questions, questionCategories, subjects } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

// Mirrors the gradeableQuestion filter in lib/exam/actions-core.ts — a
// free_response question with no model answer has nothing for
// gradeFreeResponseAnswers to compare against, so it's excluded from the
// picker the same way it's excluded from ad-hoc practice pools. Nothing
// else currently stops a free_response question from landing in a
// curated exam's exam_questions, so this is the one place that invariant
// is enforced for full_mock/daily_challenge exams.
const gradeableQuestion = or(eq(questions.type, "mcq"), and(eq(questions.type, "free_response"), isNotNull(questions.correctAnswerText)));

export type ExamListFilters = {
  search?: string;
  mode?: "all" | "full_mock" | "daily_challenge";
  page: number;
  pageSize: number;
};

export type ExamListRow = {
  id: string;
  title: string;
  mode: "full_mock" | "daily_challenge";
  timeLimitSeconds: number;
  challengeDate: string | null;
  isPublished: boolean;
  questionCount: number;
  createdAt: Date;
};

export async function listExams(userId: string, role: UserRole, filters: ExamListFilters): Promise<{ rows: ExamListRow[]; total: number }> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      conditions.push(ilike(exams.title, `%${filters.search}%`));
    }
    if (filters.mode && filters.mode !== "all") {
      conditions.push(eq(exams.mode, filters.mode));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rawRows, totalRow] = await Promise.all([
      tx
        .select({
          id: exams.id,
          title: exams.title,
          mode: exams.mode,
          timeLimitSeconds: exams.timeLimitSeconds,
          challengeDate: exams.challengeDate,
          isPublished: exams.isPublished,
          createdAt: exams.createdAt,
          questionCount: sql<number>`(select count(*)::int from exam_questions where exam_questions.exam_id = ${exams.id})`,
        })
        .from(exams)
        .where(where)
        .orderBy(desc(exams.createdAt))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(exams)
        .where(where)
        .then((r) => r[0]?.count ?? 0),
    ]);

    // exams_curated_modes_only (0003_exam_schema.sql) guarantees every row
    // here is full_mock or daily_challenge — Drizzle's inferred type just
    // doesn't know about that DB-level CHECK constraint.
    const rows: ExamListRow[] = rawRows.map((r) => ({ ...r, mode: r.mode as "full_mock" | "daily_challenge" }));

    return { rows, total: totalRow };
  });
}

export type ExamForEdit = {
  id: string;
  title: string;
  description: string | null;
  mode: "full_mock" | "daily_challenge";
  timeLimitSeconds: number;
  challengeDate: string | null;
  isPublished: boolean;
  questions: { id: string; title: string; subjectName: string; categoryName: string }[];
};

export async function getExamForEdit(userId: string, role: UserRole, examId: string): Promise<ExamForEdit | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [exam] = await tx.select().from(exams).where(eq(exams.id, examId));
    if (!exam) return null;

    const questionRows = await tx
      .select({
        id: questions.id,
        title: questions.title,
        subjectName: subjects.name,
        categoryName: questionCategories.name,
        position: examQuestions.position,
      })
      .from(examQuestions)
      .innerJoin(questions, eq(questions.id, examQuestions.questionId))
      .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
      .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
      .where(eq(examQuestions.examId, examId))
      .orderBy(examQuestions.position);

    return {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      mode: exam.mode as "full_mock" | "daily_challenge",
      timeLimitSeconds: exam.timeLimitSeconds,
      challengeDate: exam.challengeDate,
      isPublished: exam.isPublished,
      questions: questionRows.map(({ id, title, subjectName, categoryName }) => ({ id, title, subjectName, categoryName })),
    };
  });
}

export type EligibleQuestionRow = {
  id: string;
  title: string;
  subjectName: string;
  categoryName: string;
  type: "mcq" | "free_response";
};

/**
 * The exam-question picker's search list — published, gradeable
 * questions only (see gradeableQuestion above), optionally narrowed by
 * subject or a text search. Capped at 50 rows: this is a picker, not a
 * paginated table, and a staff member typing a search term will narrow
 * this well before it matters.
 */
export async function listEligibleQuestions(
  userId: string,
  role: UserRole,
  filters: { search?: string; subjectId?: string },
): Promise<EligibleQuestionRow[]> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [eq(questions.isPublished, true), gradeableQuestion!];
    if (filters.search) {
      conditions.push(ilike(questions.title, `%${filters.search}%`));
    }
    if (filters.subjectId) {
      conditions.push(eq(questionCategories.subjectId, filters.subjectId));
    }

    return tx
      .select({
        id: questions.id,
        title: questions.title,
        subjectName: subjects.name,
        categoryName: questionCategories.name,
        type: questions.type,
      })
      .from(questions)
      .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
      .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
      .where(and(...conditions))
      .orderBy(desc(questions.createdAt))
      .limit(50);
  });
}
