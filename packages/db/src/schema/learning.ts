import { pgTable, pgView, pgEnum, uuid, text, smallint, integer, bigint, numeric, boolean, timestamp, primaryKey, index } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { subjects, questionCategories } from "./content";
import { examSessions } from "./exams";
import { planTierEnum } from "./commerce";

// Mirrors supabase/migrations/0005_learning_schema.sql.
export const lessonContentTypeEnum = pgEnum("lesson_content_type", ["video", "pdf", "notes", "exercise"]);
export const recommendationTypeEnum = pgEnum("recommendation_type", [
  "study_plan",
  "revision",
  "mistake_explanation",
  "learning_strategy",
]);

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  requiredPlanTier: planTierEnum("required_plan_tier").notNull().default("premium_plus"),
  isPublished: boolean("is_published").notNull().default(false),
  displayOrder: smallint("display_order").notNull().default(0),
  createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    position: smallint("position").notNull(),
    contentType: lessonContentTypeEnum("content_type").notNull(),
    videoUrl: text("video_url"),
    pdfUrl: text("pdf_url"),
    notesBody: text("notes_body"),
    exerciseCategoryId: uuid("exercise_category_id").references(() => questionCategories.id),
    durationSeconds: integer("duration_seconds"),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_lessons_course").on(table.courseId)],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] }), index("idx_lesson_progress_user").on(table.userId)],
);

// Mirrors the course_progress view from 0005_learning_schema.sql
// (security_invoker = true, so a query through this automatically only
// ever sees the caller's own rows via lesson_progress_owner RLS — no
// separate ownership check needed at the app layer). Read-only,
// `.existing()`: this is derived from lesson_progress, never written
// directly.
export const courseProgressView = pgView("course_progress", {
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  completedLessons: bigint("completed_lessons", { mode: "number" }).notNull(),
  totalLessons: bigint("total_lessons", { mode: "number" }).notNull(),
  totalTimeSpentSeconds: bigint("total_time_spent_seconds", { mode: "number" }),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),
}).existing();

export const topicMastery = pgTable(
  "topic_mastery",
  {
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").notNull().references(() => questionCategories.id, { onDelete: "cascade" }),
    masteryScore: numeric("mastery_score", { precision: 4, scale: 2, mode: "number" }).notNull().default(0.5),
    questionsAttempted: integer("questions_attempted").notNull().default(0),
    questionsCorrect: integer("questions_correct").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.categoryId] })],
);

export const aiRecommendations = pgTable(
  "ai_recommendations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    type: recommendationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    relatedCategoryId: uuid("related_category_id").references(() => questionCategories.id, { onDelete: "set null" }),
    relatedSessionId: uuid("related_session_id").references(() => examSessions.id, { onDelete: "set null" }),
    modelVersion: text("model_version").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    isDismissed: boolean("is_dismissed").notNull().default(false),
    generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [index("idx_ai_recommendations_user").on(table.userId, table.generatedAt)],
);

export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type TopicMastery = typeof topicMastery.$inferSelect;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
