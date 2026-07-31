import { z } from "zod";

// Curated modes only (matches exams_curated_modes_only in
// 0003_exam_schema.sql) — subject_practice/difficulty_practice are ad-hoc
// and never live in the `exams` table, so they're not editable here.
export const examModeSchema = z.enum(["full_mock", "daily_challenge"]);

export const examFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
    description: z.union([z.string().trim().max(2000), z.literal("")]),
    mode: examModeSchema,
    timeLimitMinutes: z.number().int().min(1, "Must be at least 1 minute").max(600),
    // Empty string means "no date set" — only meaningful for daily_challenge.
    challengeDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")]),
    isPublished: z.boolean(),
    questionIds: z.array(z.string().uuid()).min(1, "Add at least one question"),
  })
  .refine((data) => (data.mode === "daily_challenge" ? data.challengeDate !== "" : true), {
    message: "Daily challenges need a date",
    path: ["challengeDate"],
  })
  .refine((data) => (data.mode === "full_mock" ? data.challengeDate === "" : true), {
    message: "Only daily challenges use a date",
    path: ["challengeDate"],
  });
export type ExamFormInput = z.infer<typeof examFormSchema>;
