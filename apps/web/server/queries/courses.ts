import "server-only";

import { eq, asc } from "drizzle-orm";
import { courses, lessons, lessonProgress, courseProgressView, subjects, questionCategories } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type AccessibleCourseRow = {
  id: string;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  subjectName: string | null;
  totalLessons: number;
  completedLessons: number;
};

/**
 * Relies entirely on courses_read_accessible (0005_learning_schema.sql)
 * to decide which courses exist for this student — a course above their
 * plan_tier simply isn't in the result set, the same way an unpublished
 * one isn't. There's no separate "locked" state to render here; RLS
 * already is the filter.
 */
export async function listAccessibleCourses(userId: string, role: UserRole): Promise<AccessibleCourseRow[]> {
  return withRlsContext(userId, role, async (tx) => {
    const courseRows = await tx
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        coverImageUrl: courses.coverImageUrl,
        subjectName: subjects.name,
        displayOrder: courses.displayOrder,
      })
      .from(courses)
      .leftJoin(subjects, eq(subjects.id, courses.subjectId))
      .orderBy(asc(courses.displayOrder));

    const progressRows = await tx
      .select({ courseId: courseProgressView.courseId, completedLessons: courseProgressView.completedLessons, totalLessons: courseProgressView.totalLessons })
      .from(courseProgressView)
      .where(eq(courseProgressView.userId, userId));
    const progressByCourseId = new Map(progressRows.map((p) => [p.courseId, p]));

    return courseRows.map((c) => {
      const progress = progressByCourseId.get(c.id);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        coverImageUrl: c.coverImageUrl,
        subjectName: c.subjectName,
        totalLessons: progress?.totalLessons ?? 0,
        completedLessons: progress?.completedLessons ?? 0,
      };
    });
  });
}

export type LessonWithProgress = {
  id: string;
  title: string;
  contentType: "video" | "pdf" | "notes" | "exercise";
  videoUrl: string | null;
  pdfUrl: string | null;
  notesBody: string | null;
  durationSeconds: number | null;
  exercise: { subjectId: string; subjectName: string; categoryName: string } | null;
  timeSpentSeconds: number;
  completedAt: Date | null;
};

export type CourseDetail = {
  id: string;
  title: string;
  description: string | null;
  lessons: LessonWithProgress[];
};

/**
 * `lessons_read_accessible` already restricts this to published lessons
 * in a course the student's plan tier can reach — the same RLS policy
 * that gates the catalog listing. If the course itself isn't accessible
 * (locked or unpublished), this simply returns no lessons, which the
 * caller treats as "not found."
 */
export async function getCourseDetail(userId: string, role: UserRole, courseId: string): Promise<CourseDetail | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [course] = await tx
      .select({ id: courses.id, title: courses.title, description: courses.description })
      .from(courses)
      .where(eq(courses.id, courseId));
    if (!course) return null;

    const lessonRows = await tx
      .select({
        id: lessons.id,
        title: lessons.title,
        contentType: lessons.contentType,
        videoUrl: lessons.videoUrl,
        pdfUrl: lessons.pdfUrl,
        notesBody: lessons.notesBody,
        durationSeconds: lessons.durationSeconds,
        exerciseSubjectId: subjects.id,
        exerciseSubjectName: subjects.name,
        exerciseCategoryName: questionCategories.name,
        timeSpentSeconds: lessonProgress.timeSpentSeconds,
        completedAt: lessonProgress.completedAt,
      })
      .from(lessons)
      .leftJoin(questionCategories, eq(questionCategories.id, lessons.exerciseCategoryId))
      .leftJoin(subjects, eq(subjects.id, questionCategories.subjectId))
      .leftJoin(lessonProgress, eq(lessonProgress.lessonId, lessons.id))
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.position));

    // lessonProgress is joined without a user_id filter above because
    // RLS (lesson_progress_owner) already restricts it to this caller's
    // own row — there is at most one match per lesson regardless.
    const lessonList: LessonWithProgress[] = lessonRows.map((l) => ({
      id: l.id,
      title: l.title,
      contentType: l.contentType,
      videoUrl: l.videoUrl,
      pdfUrl: l.pdfUrl,
      notesBody: l.notesBody,
      durationSeconds: l.durationSeconds,
      exercise: l.exerciseSubjectId && l.exerciseSubjectName && l.exerciseCategoryName
        ? { subjectId: l.exerciseSubjectId, subjectName: l.exerciseSubjectName, categoryName: l.exerciseCategoryName }
        : null,
      timeSpentSeconds: l.timeSpentSeconds ?? 0,
      completedAt: l.completedAt ?? null,
    }));

    return { id: course.id, title: course.title, description: course.description, lessons: lessonList };
  });
}
