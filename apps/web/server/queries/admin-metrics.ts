import "server-only";

import { sql, eq, gte } from "drizzle-orm";
import {
  profiles,
  examSessions,
  examResults,
  payments,
  sessionAnswers,
  questions,
  questionCategories,
  subjects,
  type Database,
} from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

// A student with at least one exam session started in this window counts
// as "active" — a coarse, easy-to-explain definition that doesn't need a
// dedicated last_seen column anywhere.
const ACTIVE_WINDOW_DAYS = 30;
const POPULAR_SUBJECTS_LIMIT = 5;

export type PopularSubject = {
  subjectId: string;
  subjectName: string;
  attemptCount: number;
};

export type AdminDashboardMetrics = {
  totalStudents: number;
  activeUsers: number;
  examsCompleted: number;
  averageScore: number | null;
  revenueCents: number;
  popularSubjects: PopularSubject[];
};

/**
 * Every read here goes through withRlsContext rather than the elevated
 * `db` — the staff-read RLS policies (exam_results_staff_read,
 * payments_staff_read, profiles_admin_read_all, ...) already grant
 * exactly this cross-user visibility to an admin, so there's no reason
 * to bypass RLS for a page that's pure reporting. See lib/db.ts's
 * docstring on when the elevated client is actually warranted.
 */
export async function getAdminDashboardMetrics(userId: string, role: UserRole): Promise<AdminDashboardMetrics> {
  return withRlsContext(userId, role, async (tx: Database) => {
    const activeSince = new Date(Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const [
      totalStudentsRow,
      activeUsersRow,
      examsCompletedRow,
      averageScoreRow,
      revenueRow,
      popularSubjectsRows,
    ] = await Promise.all([
      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(profiles)
        .where(eq(profiles.role, "student"))
        .then((rows) => rows[0]?.count ?? 0),

      tx
        .select({ count: sql<number>`count(distinct ${examSessions.userId})::int` })
        .from(examSessions)
        .where(gte(examSessions.startedAt, activeSince))
        .then((rows) => rows[0]?.count ?? 0),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(examResults)
        .then((rows) => rows[0]?.count ?? 0),

      tx
        .select({ average: sql<number | null>`avg(${examResults.percentage})` })
        .from(examResults)
        .then((rows) => rows[0]?.average ?? null),

      tx
        .select({ total: sql<number | null>`sum(${payments.amountCents})` })
        .from(payments)
        .where(eq(payments.status, "succeeded"))
        .then((rows) => rows[0]?.total ?? 0),

      tx
        .select({
          subjectId: subjects.id,
          subjectName: subjects.name,
          attemptCount: sql<number>`count(*)::int`,
        })
        .from(sessionAnswers)
        .innerJoin(questions, eq(questions.id, sessionAnswers.questionId))
        .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
        .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
        .groupBy(subjects.id, subjects.name)
        .orderBy(sql`count(*) desc`)
        .limit(POPULAR_SUBJECTS_LIMIT),
    ]);

    return {
      totalStudents: totalStudentsRow,
      activeUsers: activeUsersRow,
      examsCompleted: examsCompletedRow,
      averageScore: averageScoreRow === null ? null : Number(averageScoreRow),
      revenueCents: Number(revenueRow ?? 0),
      popularSubjects: popularSubjectsRows,
    };
  });
}
