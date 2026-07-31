import { z } from "zod";

const optionalUrl = z.union([z.string().url("Enter a valid URL"), z.literal("")]);

export const questionOptionSchema = z.object({
  // Present when editing an existing option; absent for a brand-new one.
  id: z.string().uuid().optional(),
  content: z.string().trim().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});
export type QuestionOptionInput = z.infer<typeof questionOptionSchema>;

export const attachmentSchema = z.object({
  url: z.string().url("Enter a valid URL"),
  name: z.string().trim().min(1, "Enter a label for this attachment"),
});
export type AttachmentInput = z.infer<typeof attachmentSchema>;

export const questionFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
    body: z.string().trim().min(3, "Question body is required"),
    categoryId: z.string().uuid("Choose a topic"),
    difficulty: z.number().min(0).max(1),
    imageUrl: optionalUrl,
    attachments: z.array(attachmentSchema).max(10),
    authorExplanation: z.union([z.string().trim().max(4000), z.literal("")]),
    isPublished: z.boolean(),
    options: z.array(questionOptionSchema).min(2, "Add at least 2 options").max(8, "At most 8 options"),
  })
  .refine((data) => data.options.filter((o) => o.isCorrect).length === 1, {
    message: "Exactly one option must be marked correct",
    path: ["options"],
  });
export type QuestionFormInput = z.infer<typeof questionFormSchema>;

// ============================================================
// Bulk import (CSV/XLSX) — one row per question, MCQ only.
// ============================================================
export const importRowSchema = z
  .object({
    title: z.string().trim().min(1, "title is required"),
    body: z.string().trim().min(1, "body is required"),
    subject: z.string().trim().min(1, "subject is required"),
    topic: z.string().trim().min(1, "topic is required"),
    difficulty: z.coerce.number().min(0).max(1).default(0.5),
    option1: z.string().trim().min(1, "option1 is required"),
    option2: z.string().trim().min(1, "option2 is required"),
    option3: z.string().trim().default(""),
    option4: z.string().trim().default(""),
    correctOption: z.coerce.number().int().min(1, "correctOption must be 1-4").max(4, "correctOption must be 1-4"),
    explanation: z.string().trim().default(""),
    imageUrl: z.union([z.string().trim().url(), z.literal("")]).default(""),
  })
  .refine(
    (row) => {
      const options = [row.option1, row.option2, row.option3, row.option4];
      return (options[row.correctOption - 1]?.length ?? 0) > 0;
    },
    { message: "correctOption must point to a non-empty option column", path: ["correctOption"] },
  );
export type ImportRow = z.infer<typeof importRowSchema>;
