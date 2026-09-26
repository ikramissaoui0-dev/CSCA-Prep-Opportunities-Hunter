import { pgTable, pgView, pgEnum, uuid, text, smallint, numeric, boolean, jsonb, timestamp, index, unique, type AnyPgColumn } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { planTierEnum } from "./commerce";

// Mirrors supabase/migrations/0002_content_schema.sql.
export const questionTypeEnum = pgEnum("question_type", ["mcq", "free_response"]);

export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  displayOrder: smallint("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const questionCategories = pgTable(
  "question_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    // One level of nesting only (a "topic group" like Functions
    // containing topics like Calculus) — null for both a top-level group
    // and a standalone topic with no subdivisions; see
    // 0013_exam_subjects_seed.sql's comment.
    parentId: uuid("parent_id").references((): AnyPgColumn => questionCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: smallint("display_order").notNull().default(0),
    // Phase 1 launch scoping (0016_practice_free_preview.sql): a free
    // account gets exactly one series per subject at 'free', everything
    // else defaults 'premium' — checked the same way courses/lessons
    // gate on required_plan_tier, via plan_tier_rank/current_user_plan_tier().
    requiredPlanTier: planTierEnum("required_plan_tier").notNull().default("premium"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_question_categories_subject").on(table.subjectId),
    index("idx_question_categories_parent").on(table.parentId),
    unique().on(table.subjectId, table.slug),
  ],
);

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").notNull().references(() => questionCategories.id, { onDelete: "restrict" }),
    type: questionTypeEnum("type").notNull().default("mcq"),
    difficulty: numeric("difficulty", { precision: 4, scale: 2, mode: "number" }).notNull().default(0.5),
    title: text("title").notNull(),
    body: text("body").notNull(),
    correctAnswerText: text("correct_answer_text"),
    authorExplanation: text("author_explanation"),
    imageUrl: text("image_url"),
    attachments: jsonb("attachments").notNull().default([]),
    isPublished: boolean("is_published").notNull().default(false),
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_questions_category_difficulty").on(table.categoryId, table.difficulty),
    index("idx_questions_published").on(table.isPublished),
  ],
);

export const questionOptions = pgTable(
  "question_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
    position: smallint("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_question_options_question").on(table.questionId), unique().on(table.questionId, table.position)],
);

// Mirrors the question_options_public view from 0002_content_schema.sql
// — deliberately created by that raw migration, not by Drizzle, since it
// exists specifically to run with different privileges than the table
// it wraps (see that migration's comments). `.existing()` tells Drizzle
// to only ever SELECT from it, never try to create or alter it.
export const questionOptionsPublicView = pgView("question_options_public", {
  id: uuid("id").notNull(),
  questionId: uuid("question_id").notNull(),
  content: text("content").notNull(),
  position: smallint("position").notNull(),
}).existing();

export const explanations = pgTable(
  "explanations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
    language: text("language").notNull().default("en"),
    content: text("content").notNull(),
    modelVersion: text("model_version").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.questionId, table.language)],
);

export type Subject = typeof subjects.$inferSelect;
export type QuestionCategory = typeof questionCategories.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type QuestionOption = typeof questionOptions.$inferSelect;
export type Explanation = typeof explanations.$inferSelect;
