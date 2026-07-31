import "server-only";

import { eq, and, ilike, sql, desc, type SQL } from "drizzle-orm";
import { courses, lessons, subjects } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type CourseListFilters = {
  search?: string;
  status?: "all" | "published" | "draft";
  page: number;
  pageSize: number;
};

export type CourseListRow = {
  id: string;
  title: string;
  subjectName: string | null;
  requiredPlanTier: "free" | "premium" | "premium_plus";
  isPublished: boolean;
  lessonCount: number;
  createdAt: Date;
};

export async function listCourses(userId: string, role: UserRole, filters: CourseListFilters): Promise<{ rows: CourseListRow[]; total: number }> {
  return withRlsContext(userId, role, async (tx) => {
    const conditions: SQL[] = [];
    if (filters.search) {
      conditions.push(ilike(courses.title, `%${filters.search}%`));
    }
    if (filters.status === "published") {
      conditions.push(eq(courses.isPublished, true));
    } else if (filters.status === "draft") {
      conditions.push(eq(courses.isPublished, false));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRow] = await Promise.all([
      tx
        .select({
          id: courses.id,
          title: courses.title,
          subjectName: subjects.name,
          requiredPlanTier: courses.requiredPlanTier,
          isPublished: courses.isPublished,
          createdAt: courses.createdAt,
          lessonCount: sql<number>`(select count(*)::int from lessons where lessons.course_id = ${courses.id})`,
        })
        .from(courses)
        .leftJoin(subjects, eq(subjects.id, courses.subjectId))
        .where(where)
        .orderBy(courses.displayOrder, desc(courses.createdAt))
        .limit(filters.pageSize)
        .offset((filters.page - 1) * filters.pageSize),

      tx
        .select({ count: sql<number>`count(*)::int` })
        .from(courses)
        .where(where)
        .then((r) => r[0]?.count ?? 0),
    ]);

    return { rows, total: totalRow };
  });
}

export type CourseForEdit = {
  id: string;
  title: string;
  subjectId: string | null;
  description: string | null;
  coverImageUrl: string | null;
  requiredPlanTier: "free" | "premium" | "premium_plus";
  isPublished: boolean;
  displayOrder: number;
};

export async function getCourseForEdit(userId: string, role: UserRole, courseId: string): Promise<CourseForEdit | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [course] = await tx.select().from(courses).where(eq(courses.id, courseId));
    if (!course) return null;
    return {
      id: course.id,
      title: course.title,
      subjectId: course.subjectId,
      description: course.description,
      coverImageUrl: course.coverImageUrl,
      requiredPlanTier: course.requiredPlanTier,
      isPublished: course.isPublished,
      displayOrder: course.displayOrder,
    };
  });
}

// A course rarely has more than a few dozen lessons, so the admin
// manager fetches every field up front for the whole list — unlike the
// paginated question bank, there's no reason to split "list" and "edit"
// shapes here.
export type LessonRow = {
  id: string;
  courseId: string;
  title: string;
  contentType: "video" | "pdf" | "notes" | "exercise";
  videoUrl: string | null;
  pdfUrl: string | null;
  notesBody: string | null;
  exerciseCategoryId: string | null;
  position: number;
  durationSeconds: number | null;
  isPublished: boolean;
};

export async function getCourseLessons(userId: string, role: UserRole, courseId: string): Promise<LessonRow[]> {
  return withRlsContext(userId, role, (tx) =>
    tx
      .select({
        id: lessons.id,
        courseId: lessons.courseId,
        title: lessons.title,
        contentType: lessons.contentType,
        videoUrl: lessons.videoUrl,
        pdfUrl: lessons.pdfUrl,
        notesBody: lessons.notesBody,
        exerciseCategoryId: lessons.exerciseCategoryId,
        position: lessons.position,
        durationSeconds: lessons.durationSeconds,
        isPublished: lessons.isPublished,
      })
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.position),
  );
}
