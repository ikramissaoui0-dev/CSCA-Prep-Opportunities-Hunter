"use server";

import { requireUser } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { recordLessonAccessCore, addLessonTimeSpentCore, setLessonCompletedCore } from "@/lib/learning/progress-actions-core";
import { lessonIdSchema, addLessonTimeSchema, setLessonCompletedSchema } from "@/lib/validation/learning";

export async function recordLessonAccess(lessonId: string): Promise<ActionResult<null>> {
  const parsed = lessonIdSchema.safeParse(lessonId);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR"));
  }
  const user = await requireUser();
  return recordLessonAccessCore(user, parsed.data);
}

export async function addLessonTimeSpent(lessonId: string, seconds: number): Promise<ActionResult<null>> {
  const parsed = addLessonTimeSchema.safeParse({ lessonId, seconds });
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireUser();
  return addLessonTimeSpentCore(user, parsed.data.lessonId, parsed.data.seconds);
}

export async function setLessonCompleted(lessonId: string, completed: boolean): Promise<ActionResult<null>> {
  const parsed = setLessonCompletedSchema.safeParse({ lessonId, completed });
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR"));
  }
  const user = await requireUser();
  return setLessonCompletedCore(user, parsed.data.lessonId, parsed.data.completed);
}
