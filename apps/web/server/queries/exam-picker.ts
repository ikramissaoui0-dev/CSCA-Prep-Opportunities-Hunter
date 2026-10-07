import "server-only";

import { eq, and, desc, inArray } from "drizzle-orm";
import { exams, examQuestions, examSessions, questions, subjects, questionCategories } from "@csca/db";
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
): Promise<{ pastExamPapers: CuratedExam[]; mockExams: CuratedExam[]; dailyChallenge: CuratedExam | null }> {
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
    const fullMockIds = rows.filter((r) => r.mode === "full_mock").map((r) => r.id);

    // full_mock covers both "Past exam papers" and "Mock exams" — there's
    // no separate exam mode for the two (both are curated, timed, 48-ish
    // question sets built the same way in /admin/exams), so which bucket
    // a curated exam belongs to is derived from its questions' category
    // rather than a stored flag: any exam pulling from the "Mock exams"
    // question_categories row (slug examens-blancs) is a mock exam,
    // everything else full_mock is a real past paper.
    let mockExamIds = new Set<string>();
    if (fullMockIds.length > 0) {
      const mockRows = await tx
        .selectDistinct({ examId: examQuestions.examId })
        .from(examQuestions)
        .innerJoin(questions, eq(questions.id, examQuestions.questionId))
        .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
        .where(and(inArray(examQuestions.examId, fullMockIds), eq(questionCategories.slug, "examens-blancs")));
      mockExamIds = new Set(mockRows.map((r) => r.examId));
    }

    const toCuratedExam = (r: (typeof rows)[number]): CuratedExam => ({
      id: r.id,
      title: r.title,
      description: r.description,
      timeLimitSeconds: r.timeLimitSeconds,
      questionCount: null,
    });

    return {
      pastExamPapers: rows.filter((r) => r.mode === "full_mock" && !mockExamIds.has(r.id)).map(toCuratedExam),
      mockExams: rows.filter((r) => r.mode === "full_mock" && mockExamIds.has(r.id)).map(toCuratedExam),
      dailyChallenge: rows.filter((r) => r.mode === "daily_challenge" && r.challengeDate === today).map(toCuratedExam)[0] ?? null,
    };
  });
}

export type PracticeSubtopic = { id: string; name: string };

export type PracticeTopic = {
  id: string;
  name: string;
  // A topic group's own children (e.g. Functions -> Calculus/Sequences/…).
  // Empty for a standalone topic with no further subdivision (e.g.
  // Probability & Statistics) — the UI shows a second dropdown only when
  // this is non-empty. Topic-level access no longer varies by plan —
  // see getUsedFreeSubjectIds below for how the free tier is actually
  // gated now (one whole-subject session, not one topic).
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

      if (row.categoryParentId) {
        const siblings = childRowsByParentId.get(row.categoryParentId) ?? [];
        siblings.push({ id: row.categoryId, name: stripPracticePrefix(row.categoryName) });
        childRowsByParentId.set(row.categoryParentId, siblings);
      } else {
        const topic: PracticeTopic = { id: row.categoryId, name: stripPracticePrefix(row.categoryName), subtopics: [] };
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

/**
 * Which subjects a free account has already spent its one practice
 * session on (Phase 1 launch scoping — see startExamCore's subject_
 * practice branch, the actual enforcement point). Powers the picker UI
 * showing "already used" instead of letting a free student pick a
 * subject only to be rejected after clicking Start. Irrelevant for a
 * paid account (unlimited subjects), so callers only need this for a
 * free-tier viewer.
 */
export async function getUsedFreeSubjectIds(userId: string, role: UserRole): Promise<Set<string>> {
  return withRlsContext(userId, role, async (tx) => {
    const rows = await tx
      .selectDistinct({ subjectId: examSessions.subjectId })
      .from(examSessions)
      .where(and(eq(examSessions.userId, userId), eq(examSessions.mode, "subject_practice")));
    return new Set(rows.map((r) => r.subjectId).filter((id): id is string => id !== null));
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
