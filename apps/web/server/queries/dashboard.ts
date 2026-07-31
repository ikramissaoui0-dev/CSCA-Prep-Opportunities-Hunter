import "server-only";

import { eq, desc, sql } from "drizzle-orm";
import {
  profiles,
  examSessions,
  examResults,
  exams,
  topicMastery,
  questionCategories,
  subjects,
  aiRecommendations,
  type Database,
} from "@csca/db";

export type SubjectMastery = {
  categoryId: string;
  categoryName: string;
  subjectName: string;
  masteryScore: number;
  questionsAttempted: number;
};

export type LatestResult = {
  sessionId: string;
  examTitle: string | null;
  mode: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: Date | null;
};

// submittedAt is nullable in the schema (a session can theoretically
// exist without one), even though app logic never creates exam_results
// before a session is submitted — stay honest about that in the type.
export type ProgressPoint = { date: Date | null; percentage: number };

export type RecommendedAction = {
  id: string;
  title: string;
  content: string;
  isFallback: boolean;
};

export type StudentDashboardData = {
  profile: { fullName: string | null; avatarUrl: string | null };
  stats: { completedTests: number; averageScore: number | null };
  latestResults: LatestResult[];
  progressSeries: ProgressPoint[];
  weakSubjects: SubjectMastery[];
  strongSubjects: SubjectMastery[];
  recommendations: RecommendedAction[];
};

// Below this many attempts in a category, mastery_score is mostly noise
// (it starts at a neutral 0.5 default and hasn't seen enough evidence to
// mean anything) — exclude it from weak/strong framing entirely rather
// than show a misleading signal.
const MIN_ATTEMPTS_FOR_MASTERY_SIGNAL = 3;
const RECENT_RESULTS_LIMIT = 5;
const PROGRESS_SERIES_LIMIT = 20;

/**
 * Splits mastery rows into "weak" and "strong" by sorting ascending and
 * cutting at the midpoint — the bottom half is weak, the top half is
 * strong, each capped at 3 for display. This guarantees the two lists
 * never overlap (unlike independently taking "bottom 3" and "top 3",
 * which double-counts every category when there are 6 or fewer). A
 * single tracked category has no "strong" side yet — that's correct,
 * not a bug, there's nothing to compare it against.
 */
export function splitWeakStrongSubjects(rows: SubjectMastery[]): {
  weak: SubjectMastery[];
  strong: SubjectMastery[];
} {
  const withSignal = rows.filter((r) => r.questionsAttempted >= MIN_ATTEMPTS_FOR_MASTERY_SIGNAL);
  const sorted = [...withSignal].sort((a, b) => a.masteryScore - b.masteryScore);
  const midpoint = Math.ceil(sorted.length / 2);

  return {
    weak: sorted.slice(0, midpoint).slice(0, 3),
    strong: sorted.slice(midpoint).slice(-3).reverse(),
  };
}

/**
 * Rule-based stand-in for Phase 7's AI-generated recommendations, used
 * whenever a student has no (unread, non-dismissed) AI recommendation
 * yet — which is everyone, until Phase 7 ships. Not a placeholder to
 * delete later: even after Phase 7 lands, a brand-new student still has
 * nothing for the AI to analyze, so this empty-state path stays.
 */
export function buildFallbackRecommendations(weakSubjects: SubjectMastery[], completedTests: number): RecommendedAction[] {
  if (completedTests === 0) {
    return [
      {
        id: "fallback-first-exam",
        title: "Take your first mock exam",
        content: "Start with a full CSCA simulation to get a baseline score and unlock personalized recommendations.",
        isFallback: true,
      },
    ];
  }

  if (weakSubjects.length === 0) {
    return [
      {
        id: "fallback-keep-practicing",
        title: "Keep up the momentum",
        content: "Complete a few more mock exams so we can identify subjects that need extra attention.",
        isFallback: true,
      },
    ];
  }

  return weakSubjects.slice(0, 2).map((s) => ({
    id: `fallback-${s.categoryId}`,
    title: `Practice ${s.categoryName}`,
    content: `Your mastery in ${s.categoryName} (${s.subjectName}) is around ${Math.round(s.masteryScore * 100)}%. A focused practice session here will move the needle fastest.`,
    isFallback: true,
  }));
}

/**
 * `db` must be an RLS-scoped connection (see lib/db.ts's withRlsContext)
 * — never the raw admin client — since this reads one student's data
 * and RLS is what actually enforces that scoping.
 */
export async function getStudentDashboardData(db: Database, userId: string): Promise<StudentDashboardData> {
  const [profileRow, statsRow, latestResultsRows, progressRows, masteryRows, recommendationRows] = await Promise.all([
    db
      .select({ fullName: profiles.fullName, avatarUrl: profiles.avatarUrl })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .then((rows) => rows[0] ?? { fullName: null, avatarUrl: null }),

    db
      .select({
        completedTests: sql<number>`count(*)::int`,
        averageScore: sql<number | null>`avg(${examResults.percentage})`,
      })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .where(eq(examSessions.userId, userId))
      .then((rows) => rows[0] ?? { completedTests: 0, averageScore: null }),

    db
      .select({
        sessionId: examResults.sessionId,
        examTitle: exams.title,
        mode: examSessions.mode,
        percentage: examResults.percentage,
        correctCount: examResults.correctCount,
        totalQuestions: examResults.totalQuestions,
        submittedAt: examSessions.submittedAt,
      })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .leftJoin(exams, eq(exams.id, examSessions.examId))
      .where(eq(examSessions.userId, userId))
      // submittedAt (when the exam happened), not exam_results.created_at
      // (when the row was computed) — these usually coincide, but the
      // session's own timestamp is the one that's actually meaningful if
      // a result is ever recomputed/backfilled later.
      .orderBy(desc(examSessions.submittedAt))
      .limit(RECENT_RESULTS_LIMIT),

    db
      .select({ date: examSessions.submittedAt, percentage: examResults.percentage })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .where(eq(examSessions.userId, userId))
      .orderBy(examSessions.submittedAt)
      .limit(PROGRESS_SERIES_LIMIT),

    db
      .select({
        categoryId: topicMastery.categoryId,
        categoryName: questionCategories.name,
        subjectName: subjects.name,
        masteryScore: topicMastery.masteryScore,
        questionsAttempted: topicMastery.questionsAttempted,
      })
      .from(topicMastery)
      .innerJoin(questionCategories, eq(questionCategories.id, topicMastery.categoryId))
      .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
      .where(eq(topicMastery.userId, userId)),

    db
      .select({
        id: aiRecommendations.id,
        title: aiRecommendations.title,
        content: aiRecommendations.content,
      })
      .from(aiRecommendations)
      .where(eq(aiRecommendations.userId, userId))
      .orderBy(desc(aiRecommendations.generatedAt))
      .limit(3),
  ]);

  const { weak, strong } = splitWeakStrongSubjects(masteryRows);

  const recommendations: RecommendedAction[] =
    recommendationRows.length > 0
      ? recommendationRows.map((r) => ({ id: r.id, title: r.title, content: r.content, isFallback: false }))
      : buildFallbackRecommendations(weak, statsRow.completedTests);

  return {
    profile: profileRow,
    stats: {
      completedTests: statsRow.completedTests,
      averageScore: statsRow.averageScore === null ? null : Number(statsRow.averageScore),
    },
    latestResults: latestResultsRows,
    progressSeries: progressRows,
    weakSubjects: weak,
    strongSubjects: strong,
    recommendations,
  };
}
