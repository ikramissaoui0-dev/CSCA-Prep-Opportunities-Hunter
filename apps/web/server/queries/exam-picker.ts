import "server-only";

import { eq, and, desc } from "drizzle-orm";
import { exams, examSessions, subjects, questionCategories } from "@csca/db";
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

export type PracticeSubtopic = { id: string; name: string; isFree: boolean };

export type PracticeTopic = {
  id: string;
  name: string;
  // Whether a free account can practice this topic — see
  // 0016_practice_free_preview.sql's required_plan_tier column. Checked
  // again server-side in startExamCore; this is only for the UI to show
  // a lock badge and disable the choice up front.
  isFree: boolean;
  // A topic group's own children (e.g. Functions -> Calculus/Sequences/…).
  // Empty for a standalone topic with no further subdivision (e.g.
  // Probability & Statistics) — the UI shows a second dropdown only when
  // this is non-empty.
  subtopics: PracticeSubtopic[];
};

export type SubjectWithTopics = {
  id: string;
  name: string;
  slug: string;
  topics: PracticeTopic[];
};

// Only "Practice exercises - <topic>" categories are real, randomly
// practiceable topics — "Mock exams" and "Past exam papers" are curated,
// composed exams (the `exams` table), not something to pull a random
// subset of questions from, so they're excluded from this picker.
const PRACTICE_TOPIC_PREFIX = "Practice exercises - ";

function stripPracticePrefix(name: string): string {
  return name.startsWith(PRACTICE_TOPIC_PREFIX) ? name.slice(PRACTICE_TOPIC_PREFIX.length) : name;
}

/**
 * Each subject's topics (question_categories), one level deep, so
 * "Practice by subject" can offer "this subject, this topic group, this
 * specific topic" down to "this subject, every topic" — the two
 * dropdowns are populated client-side from this, no extra round trip
 * when the student changes the subject or topic-group select.
 */
export async function getSubjectsForPractice(userId: string, role: UserRole): Promise<SubjectWithTopics[]> {
  return withRlsContext(userId, role, async (tx) => {
    const rows = await tx
      .select({
        subjectId: subjects.id,
        subjectName: subjects.name,
        subjectSlug: subjects.slug,
        categoryId: questionCategories.id,
        categoryName: questionCategories.name,
        categoryParentId: questionCategories.parentId,
        requiredPlanTier: questionCategories.requiredPlanTier,
      })
      .from(subjects)
      .leftJoin(questionCategories, eq(questionCategories.subjectId, subjects.id))
      .orderBy(subjects.displayOrder, questionCategories.displayOrder);

    const bySubject = new Map<string, SubjectWithTopics>();
    const topicsById = new Map<string, PracticeTopic>();
    const childRowsByParentId = new Map<string, PracticeSubtopic[]>();

    for (const row of rows) {
      const entry = bySubject.get(row.subjectId) ?? { id: row.subjectId, name: row.subjectName, slug: row.subjectSlug, topics: [] };
      bySubject.set(row.subjectId, entry);
      if (!row.categoryId || !row.categoryName?.startsWith(PRACTICE_TOPIC_PREFIX)) continue;

      const isFree = row.requiredPlanTier === "free";
      if (row.categoryParentId) {
        const siblings = childRowsByParentId.get(row.categoryParentId) ?? [];
        siblings.push({ id: row.categoryId, name: stripPracticePrefix(row.categoryName), isFree });
        childRowsByParentId.set(row.categoryParentId, siblings);
      } else {
        const topic: PracticeTopic = { id: row.categoryId, name: stripPracticePrefix(row.categoryName), isFree, subtopics: [] };
        entry.topics.push(topic);
        topicsById.set(row.categoryId, topic);
      }
    }

    for (const [parentId, children] of childRowsByParentId) {
      const parent = topicsById.get(parentId);
      if (parent) parent.subtopics = children;
    }

    return [...bySubject.values()];
  });
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
