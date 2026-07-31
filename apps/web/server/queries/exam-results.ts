import "server-only";

import { eq, inArray } from "drizzle-orm";
import { examResults, examSessions, exams, subjects } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type ExamResultView = {
  sessionId: string;
  mode: string;
  examTitle: string | null;
  status: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  percentage: number;
  timeSpentSeconds: number;
  submittedAt: Date | null;
  subjectBreakdown: { subjectId: string; subjectName: string; correct: number; total: number; percentage: number }[];
};

/**
 * Null if the session doesn't belong to this user, or hasn't been
 * finalized yet (exam_results only exists once a session is
 * submitted/expired) — the page treats null as "go back to the
 * exam-taking view" rather than a 404, since that's usually why it's null.
 */
export async function getExamResult(userId: string, role: UserRole, sessionId: string): Promise<ExamResultView | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [row] = await tx
      .select({
        sessionId: examSessions.id,
        userId: examSessions.userId,
        mode: examSessions.mode,
        examTitle: exams.title,
        status: examSessions.status,
        totalQuestions: examResults.totalQuestions,
        correctCount: examResults.correctCount,
        wrongCount: examResults.wrongCount,
        skippedCount: examResults.skippedCount,
        percentage: examResults.percentage,
        timeSpentSeconds: examResults.timeSpentSeconds,
        subjectBreakdown: examResults.subjectBreakdown,
        submittedAt: examSessions.submittedAt,
      })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .leftJoin(exams, eq(exams.id, examSessions.examId))
      .where(eq(examResults.sessionId, sessionId));

    if (!row || row.userId !== userId) return null;

    const breakdownEntries = Object.entries(row.subjectBreakdown);
    const subjectIds = breakdownEntries.map(([id]) => id);
    const subjectRows =
      subjectIds.length > 0 ? await tx.select({ id: subjects.id, name: subjects.name }).from(subjects).where(inArray(subjects.id, subjectIds)) : [];
    const nameById = new Map(subjectRows.map((s) => [s.id, s.name]));

    return {
      sessionId: row.sessionId,
      mode: row.mode,
      examTitle: row.examTitle,
      status: row.status,
      totalQuestions: row.totalQuestions,
      correctCount: row.correctCount,
      wrongCount: row.wrongCount,
      skippedCount: row.skippedCount,
      percentage: row.percentage,
      timeSpentSeconds: row.timeSpentSeconds,
      submittedAt: row.submittedAt,
      subjectBreakdown: breakdownEntries
        .map(([subjectId, v]) => ({ subjectId, subjectName: nameById.get(subjectId) ?? "Unknown", ...v }))
        .sort((a, b) => b.percentage - a.percentage),
    };
  });
}
