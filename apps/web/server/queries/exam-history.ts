import "server-only";

import { eq, and, ne, lt, desc, sql, type SQL } from "drizzle-orm";
import { examSessions, examResults, exams } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type ExamMode = "full_mock" | "subject_practice" | "difficulty_practice" | "daily_challenge";

export type ExamHistoryFilters = {
  mode?: ExamMode;
  page: number;
  pageSize: number;
};

export type ExamHistoryRow = {
  sessionId: string;
  examTitle: string | null;
  mode: string;
  status: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  submittedAt: Date | null;
};

export async function listExamHistory(
  userId: string,
  role: UserRole,
  filters: ExamHistoryFilters,
): Promise<{ rows: ExamHistoryRow[]; total: number }> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [eq(examSessions.userId, userId)];
    if (filters.mode) conditions.push(eq(examSessions.mode, filters.mode));
    const where = and(...conditions);

    const [rows, [{ count }]] = await Promise.all([
      tx
        .select({
          sessionId: examResults.sessionId,
          examTitle: exams.title,
          mode: examSessions.mode,
          status: examSessions.status,
          percentage: examResults.percentage,
          correctCount: examResults.correctCount,
          totalQuestions: examResults.totalQuestions,
          timeSpentSeconds: examResults.timeSpentSeconds,
          submittedAt: examSessions.submittedAt,
        })
        .from(examResults)
        .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
        .leftJoin(exams, eq(exams.id, examSessions.examId))
        .where(where)
        .orderBy(desc(examSessions.submittedAt))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(examResults)
        .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
        .where(where),
    ]);

    return { rows, total: count };
  });
}

export type ProgressPoint = { date: Date | null; percentage: number };

/**
 * The dashboard (Phase 3) shows an abbreviated, most-recent slice of
 * this same data — this is the complete history, optionally scoped to
 * one mode, for the dedicated results page.
 */
export async function getProgressEvolution(userId: string, role: UserRole, mode?: ExamMode): Promise<ProgressPoint[]> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [eq(examSessions.userId, userId)];
    if (mode) conditions.push(eq(examSessions.mode, mode));

    return tx
      .select({ date: examSessions.submittedAt, percentage: examResults.percentage })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .where(and(...conditions))
      .orderBy(examSessions.submittedAt);
  });
}

export type PreviousAttemptComparison = { previousPercentage: number; previousDate: Date | null };

/**
 * "Previous attempt" means: the same curated exam if this was full_mock
 * or daily_challenge; the same subject if subject_practice; the same
 * difficulty range if difficulty_practice. Returns null for a genuine
 * first attempt — the results page treats that as "nothing to compare
 * yet", not an error.
 */
export async function getPreviousAttemptComparison(
  userId: string,
  role: UserRole,
  currentSessionId: string,
): Promise<PreviousAttemptComparison | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [current] = await tx
      .select({
        examId: examSessions.examId,
        mode: examSessions.mode,
        subjectId: examSessions.subjectId,
        difficultyMin: examSessions.difficultyMin,
        difficultyMax: examSessions.difficultyMax,
        submittedAt: examSessions.submittedAt,
      })
      .from(examSessions)
      .where(eq(examSessions.id, currentSessionId));
    if (!current) return null;

    const conditions: SQL[] = [eq(examSessions.userId, userId), ne(examSessions.id, currentSessionId)];

    if (current.examId) {
      conditions.push(eq(examSessions.examId, current.examId));
    } else if (current.mode === "subject_practice" && current.subjectId) {
      conditions.push(eq(examSessions.mode, current.mode), eq(examSessions.subjectId, current.subjectId));
    } else if (current.mode === "difficulty_practice" && current.difficultyMin !== null && current.difficultyMax !== null) {
      conditions.push(
        eq(examSessions.mode, current.mode),
        eq(examSessions.difficultyMin, current.difficultyMin),
        eq(examSessions.difficultyMax, current.difficultyMax),
      );
    } else {
      return null;
    }

    if (current.submittedAt) {
      // A typed Drizzle operator, not a raw `sql` template — the latter
      // doesn't reliably serialize an interpolated Date under postgres.js
      // when mixed into a larger `and(...)` condition list (confirmed by
      // testing against a real database: it throws "Received an instance
      // of Date" from the driver's parameter binding).
      conditions.push(lt(examSessions.submittedAt, current.submittedAt));
    }

    const [previous] = await tx
      .select({ percentage: examResults.percentage, submittedAt: examSessions.submittedAt })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .where(and(...conditions))
      .orderBy(desc(examSessions.submittedAt))
      .limit(1);

    return previous ? { previousPercentage: previous.percentage, previousDate: previous.submittedAt } : null;
  });
}
