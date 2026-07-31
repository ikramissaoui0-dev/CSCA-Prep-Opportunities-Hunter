import "server-only";

import { eq, and, ne, sql } from "drizzle-orm";
import { courses, lessons, type Database } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { withRlsContext } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { slugify } from "@/lib/slug";
import type { CourseFormInput, LessonFormInput } from "@/lib/validation/course-admin";

const MAX_SLUG_ATTEMPTS = 20;

/**
 * Slug is derived from the title once, at creation, and never touched
 * again on update — a course's URL staying stable across edits matters
 * more than it always matching the current title verbatim. Collisions
 * (two courses titled the same) get a numeric suffix rather than a
 * random one, so the slug stays readable.
 */
async function uniqueSlug(tx: Database, title: string): Promise<string> {
  const base = slugify(title);
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    const [existing] = await tx.select({ id: courses.id }).from(courses).where(eq(courses.slug, candidate));
    if (!existing) return candidate;
  }
  return `${base}-${Date.now()}`;
}

function toCourseValues(input: CourseFormInput) {
  return {
    title: input.title,
    subjectId: input.subjectId || null,
    description: input.description || null,
    coverImageUrl: input.coverImageUrl || null,
    requiredPlanTier: input.requiredPlanTier,
    isPublished: input.isPublished,
    displayOrder: input.displayOrder,
  };
}

export async function createCourseCore(user: SessionUser, input: CourseFormInput): Promise<ActionResult<{ courseId: string }>> {
  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const slug = await uniqueSlug(tx, input.title);
      const [created] = await tx
        .insert(courses)
        .values({ ...toCourseValues(input), slug, createdBy: user.id })
        .returning({ id: courses.id });
      return { courseId: created!.id };
    });
    return { success: true, data: result };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function updateCourseCore(user: SessionUser, input: CourseFormInput): Promise<ActionResult<{ courseId: string }>> {
  if (!input.id) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Missing course id"));
  }
  const courseId = input.id;

  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const [existing] = await tx.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId));
      if (!existing) {
        throw new AppError("NOT_FOUND", "Course not found");
      }
      await tx.update(courses).set({ ...toCourseValues(input), updatedAt: new Date() }).where(eq(courses.id, courseId));
      return { courseId };
    });
    return { success: true, data: result };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function deleteCourseCore(user: SessionUser, courseId: string): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, (tx) => tx.delete(courses).where(eq(courses.id, courseId)));
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function setCoursePublishedCore(user: SessionUser, courseId: string, isPublished: boolean): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, (tx) =>
      tx.update(courses).set({ isPublished, updatedAt: new Date() }).where(eq(courses.id, courseId)),
    );
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}

function toLessonValues(input: LessonFormInput) {
  return {
    courseId: input.courseId,
    title: input.title,
    contentType: input.contentType,
    videoUrl: input.contentType === "video" ? input.videoUrl || null : null,
    pdfUrl: input.contentType === "pdf" ? input.pdfUrl || null : null,
    notesBody: input.contentType === "notes" ? input.notesBody || null : null,
    exerciseCategoryId: input.contentType === "exercise" ? input.exerciseCategoryId || null : null,
    durationSeconds: input.durationMinutes === null ? null : input.durationMinutes * 60,
    isPublished: input.isPublished,
  };
}

export async function createLessonCore(user: SessionUser, input: LessonFormInput): Promise<ActionResult<{ lessonId: string }>> {
  try {
    const result = await withRlsContext(user.id, user.role, async (tx) => {
      const [{ maxPosition }] = await tx
        .select({ maxPosition: sql<number>`coalesce(max(${lessons.position}), 0)::int` })
        .from(lessons)
        .where(eq(lessons.courseId, input.courseId));

      const [created] = await tx
        .insert(lessons)
        .values({ ...toLessonValues(input), position: maxPosition + 1 })
        .returning({ id: lessons.id });
      return { lessonId: created!.id };
    });
    return { success: true, data: result };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function updateLessonCore(user: SessionUser, input: LessonFormInput): Promise<ActionResult<{ lessonId: string }>> {
  if (!input.id) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Missing lesson id"));
  }
  const lessonId = input.id;

  try {
    await withRlsContext(user.id, user.role, async (tx) => {
      const [existing] = await tx.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, lessonId));
      if (!existing) {
        throw new AppError("NOT_FOUND", "Lesson not found");
      }
      await tx.update(lessons).set({ ...toLessonValues(input), updatedAt: new Date() }).where(eq(lessons.id, lessonId));
    });
    return { success: true, data: { lessonId } };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function deleteLessonCore(user: SessionUser, lessonId: string): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, (tx) => tx.delete(lessons).where(eq(lessons.id, lessonId)));
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}

export async function setLessonPublishedCore(user: SessionUser, lessonId: string, isPublished: boolean): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, (tx) =>
      tx.update(lessons).set({ isPublished, updatedAt: new Date() }).where(eq(lessons.id, lessonId)),
    );
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}

/**
 * Reorders by swapping this lesson's position with its neighbor's,
 * rather than renumbering the whole course — one UPDATE pair instead of
 * N, and no gap-closing logic needed since positions never need to be
 * contiguous, only ordered.
 */
export async function moveLessonCore(user: SessionUser, lessonId: string, direction: -1 | 1): Promise<ActionResult<null>> {
  try {
    await withRlsContext(user.id, user.role, async (tx) => {
      const [current] = await tx.select({ id: lessons.id, courseId: lessons.courseId, position: lessons.position }).from(lessons).where(eq(lessons.id, lessonId));
      if (!current) {
        throw new AppError("NOT_FOUND", "Lesson not found");
      }

      const neighborRows = await tx
        .select({ id: lessons.id, position: lessons.position })
        .from(lessons)
        .where(and(eq(lessons.courseId, current.courseId), ne(lessons.id, lessonId)))
        .orderBy(direction === -1 ? sql`${lessons.position} desc` : sql`${lessons.position} asc`);

      const neighbor = neighborRows.find((n) => (direction === -1 ? n.position < current.position : n.position > current.position));
      if (!neighbor) return; // Already at the start/end — a no-op, not an error.

      await tx.update(lessons).set({ position: neighbor.position }).where(eq(lessons.id, current.id));
      await tx.update(lessons).set({ position: current.position }).where(eq(lessons.id, neighbor.id));
    });
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}
