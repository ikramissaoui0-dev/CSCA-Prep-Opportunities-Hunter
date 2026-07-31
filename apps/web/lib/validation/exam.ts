import { z } from "zod";

export const startExamSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("full_mock"), examId: z.string().uuid() }),
  z.object({ mode: z.literal("daily_challenge"), examId: z.string().uuid() }),
  z.object({
    mode: z.literal("subject_practice"),
    subjectId: z.string().uuid(),
    questionCount: z.number().int().min(5).max(50),
  }),
  z.object({
    mode: z.literal("difficulty_practice"),
    difficultyMin: z.number().min(0).max(1),
    difficultyMax: z.number().min(0).max(1),
    questionCount: z.number().int().min(5).max(50),
  }),
]);
export type StartExamInput = z.infer<typeof startExamSchema>;

export const saveAnswerSchema = z.union([
  z.object({
    sessionId: z.string().uuid(),
    questionId: z.string().uuid(),
    selectedOptionId: z.string().uuid(),
  }),
  z.object({
    sessionId: z.string().uuid(),
    questionId: z.string().uuid(),
    freeResponseText: z.string().trim().min(1).max(4000),
  }),
]);
export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;
