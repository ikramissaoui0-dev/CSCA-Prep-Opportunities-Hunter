import "server-only";

import { eq, and, desc } from "drizzle-orm";
import { exams, examSessions, subjects } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type CuratedExam = {
  id: string;
  title: string;
  description: string | null;
  timeLimitSeconds: number;
  questionCount: number | null;
};

export async function getPublishedCuratedExams(
  userId: string,
  role: UserRole,
): Promise<{ fullMocks: CuratedExam[]; dailyChallenge: CuratedExam | null }> {
  return withRlsContext(userId, role, async (tx) => {
    const rows = await tx
      .select({
        id: exams.id,
        title: exams.title,
        description: exams.description,
        mode: exams.mode,
        timeLimitSeconds: exams.timeLimitSeconds,
        challengeDate: exams.challengeDate,
      })
      .from(exams)
      .where(eq(exams.isPublished, true))
      .orderBy(desc(exams.createdAt));

    const today = new Date().toISOString().slice(0, 10);

    return {
      fullMocks: rows
        .filter((r) => r.mode === "full_mock")
        .map((r) => ({ id: r.id, title: r.title, description: r.description, timeLimitSeconds: r.timeLimitSeconds, questionCount: null })),
      dailyChallenge:
        rows
          .filter((r) => r.mode === "daily_challenge" && r.challengeDate === today)
          .map((r) => ({ id: r.id, title: r.title, description: r.description, timeLimitSeconds: r.timeLimitSeconds, questionCount: null }))[0] ?? null,
    };
  });
}

export async function getSubjectsForPractice(userId: string, role: UserRole) {
  return withRlsContext(userId, role, (tx) =>
    tx.select({ id: subjects.id, name: subjects.name, slug: subjects.slug }).from(subjects).orderBy(subjects.displayOrder),
  );
}

export type InProgressSession = {
  id: string;
  mode: string;
  examTitle: string | null;
  startedAt: Date;
  timeLimitSeconds: number | null;
};

export async function getInProgressSessions(userId: string, role: UserRole): Promise<InProgressSession[]> {
  return withRlsContext(userId, role, async (tx) => {
    const rows = await tx
      .select({
        id: examSessions.id,
        mode: examSessions.mode,
        examTitle: exams.title,
        startedAt: examSessions.startedAt,
        timeLimitSeconds: examSessions.timeLimitSeconds,
      })
      .from(examSessions)
      .leftJoin(exams, eq(exams.id, examSessions.examId))
      .where(and(eq(examSessions.userId, userId), eq(examSessions.status, "in_progress")))
      .orderBy(desc(examSessions.startedAt));

    return rows;
  });
}
