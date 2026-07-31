"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import {
  createCourseCore,
  updateCourseCore,
  deleteCourseCore,
  setCoursePublishedCore,
  createLessonCore,
  updateLessonCore,
  deleteLessonCore,
  setLessonPublishedCore,
  moveLessonCore,
} from "@/lib/admin/courses-actions-core";
import { courseFormSchema, lessonFormSchema, type CourseFormInput, type LessonFormInput } from "@/lib/validation/course-admin";

export async function createCourse(input: CourseFormInput): Promise<ActionResult<{ courseId: string }>> {
  const parsed = courseFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await createCourseCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/courses");
  return result;
}

export async function updateCourse(input: CourseFormInput): Promise<ActionResult<{ courseId: string }>> {
  const parsed = courseFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await updateCourseCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/courses");
  return result;
}

export async function deleteCourse(courseId: string): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await deleteCourseCore(user, courseId);
  if (result.success) revalidatePath("/admin/courses");
  return result;
}

export async function setCoursePublished(courseId: string, isPublished: boolean): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await setCoursePublishedCore(user, courseId, isPublished);
  if (result.success) revalidatePath("/admin/courses");
  return result;
}

export async function createLesson(input: LessonFormInput): Promise<ActionResult<{ lessonId: string }>> {
  const parsed = lessonFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await createLessonCore(user, parsed.data);
  if (result.success) revalidatePath(`/admin/courses/${parsed.data.courseId}`);
  return result;
}

export async function updateLesson(input: LessonFormInput): Promise<ActionResult<{ lessonId: string }>> {
  const parsed = lessonFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin", "content_manager");
  const result = await updateLessonCore(user, parsed.data);
  if (result.success) revalidatePath(`/admin/courses/${parsed.data.courseId}`);
  return result;
}

export async function deleteLesson(lessonId: string, courseId: string): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await deleteLessonCore(user, lessonId);
  if (result.success) revalidatePath(`/admin/courses/${courseId}`);
  return result;
}

export async function setLessonPublished(lessonId: string, courseId: string, isPublished: boolean): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await setLessonPublishedCore(user, lessonId, isPublished);
  if (result.success) revalidatePath(`/admin/courses/${courseId}`);
  return result;
}

export async function moveLesson(lessonId: string, courseId: string, direction: -1 | 1): Promise<ActionResult<null>> {
  const user = await requireRole("admin", "content_manager");
  const result = await moveLessonCore(user, lessonId, direction);
  if (result.success) revalidatePath(`/admin/courses/${courseId}`);
  return result;
}
