import { z } from "zod";

export const planTierSchema = z.enum(["free", "premium", "premium_plus"]);

const optionalUrl = z.union([z.string().url("Enter a valid URL"), z.literal("")]);

export const courseFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  subjectId: z.union([z.string().uuid(), z.literal("")]),
  description: z.union([z.string().trim().max(2000), z.literal("")]),
  coverImageUrl: optionalUrl,
  requiredPlanTier: planTierSchema,
  isPublished: z.boolean(),
  displayOrder: z.number().int().min(0).max(9999),
});
export type CourseFormInput = z.infer<typeof courseFormSchema>;

export const lessonContentTypeSchema = z.enum(["video", "pdf", "notes", "exercise"]);

export const lessonFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    courseId: z.string().uuid(),
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
    contentType: lessonContentTypeSchema,
    videoUrl: optionalUrl,
    pdfUrl: optionalUrl,
    notesBody: z.union([z.string().trim().max(20000), z.literal("")]),
    exerciseCategoryId: z.union([z.string().uuid(), z.literal("")]),
    durationMinutes: z.union([z.number().int().min(0).max(600), z.null()]),
    isPublished: z.boolean(),
  })
  .refine((d) => (d.contentType === "video" ? d.videoUrl !== "" : true), { message: "Video URL is required", path: ["videoUrl"] })
  .refine((d) => (d.contentType === "pdf" ? d.pdfUrl !== "" : true), { message: "PDF URL is required", path: ["pdfUrl"] })
  .refine((d) => (d.contentType === "notes" ? d.notesBody !== "" : true), { message: "Notes content is required", path: ["notesBody"] })
  .refine((d) => (d.contentType === "exercise" ? d.exerciseCategoryId !== "" : true), {
    message: "Choose a topic for the exercise",
    path: ["exerciseCategoryId"],
  });
export type LessonFormInput = z.infer<typeof lessonFormSchema>;
