import { z } from "zod";

export const lessonIdSchema = z.string().uuid();

export const addLessonTimeSchema = z.object({
  lessonId: z.string().uuid(),
  // Capped client-side too (see progress-actions-core.ts) — this is just
  // the shape check; the actual ceiling lives with the business rule.
  seconds: z.number().int().min(1).max(300),
});
export type AddLessonTimeInput = z.infer<typeof addLessonTimeSchema>;

export const setLessonCompletedSchema = z.object({
  lessonId: z.string().uuid(),
  completed: z.boolean(),
});
export type SetLessonCompletedInput = z.infer<typeof setLessonCompletedSchema>;
