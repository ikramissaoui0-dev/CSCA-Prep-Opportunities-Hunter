import { pgTable, pgEnum, uuid, text, smallint, integer, numeric, boolean, date, jsonb, timestamp, primaryKey, index, unique } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { subjects, questions, questionOptions } from "./content";

// Mirrors supabase/migrations/0003_exam_schema.sql.
export const examModeEnum = pgEnum("exam_mode", ["full_mock", "subject_practice", "difficulty_practice", "daily_challenge"]);
export const examSessionStatusEnum = pgEnum("exam_session_status", ["in_progress", "submitted", "expired"]);

export const exams = pgTable(
  "exams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    mode: examModeEnum("mode").notNull(),
    timeLimitSeconds: integer("time_limit_seconds").notNull(),
    challengeDate: date("challenge_date"),
    isPublished: boolean("is_published").notNull().default(false),
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.challengeDate)],
);

export const examQuestions = pgTable(
  "exam_questions",
  {
    examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
    questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "restrict" }),
    position: smallint("position").notNull(),
  },
  (table) => [primaryKey({ columns: [table.examId, table.questionId] }), unique().on(table.examId, table.position)],
);

export const examSessions = pgTable(
  "exam_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    examId: uuid("exam_id").references(() => exams.id, { onDelete: "restrict" }),
    mode: examModeEnum("mode").notNull(),
    subjectId: uuid("subject_id").references(() => subjects.id),
    difficultyMin: numeric("difficulty_min", { precision: 4, scale: 2, mode: "number" }),
    difficultyMax: numeric("difficulty_max", { precision: 4, scale: 2, mode: "number" }),
    questionCount: smallint("question_count"),
    timeLimitSeconds: integer("time_limit_seconds"),
    status: examSessionStatusEnum("status").notNull().default("in_progress"),
    score: numeric("score", { precision: 5, scale: 2, mode: "number" }),
    // Mirrors 0008_exam_engine_hardening.sql.
    questionOrder: jsonb("question_order").$type<string[]>().notNull().default([]),
    tabSwitchCount: integer("tab_switch_count").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_exam_sessions_user_exam").on(table.userId, table.examId),
    index("idx_exam_sessions_status").on(table.status),
  ],
);

export const sessionAnswers = pgTable(
  "session_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id").notNull().references(() => examSessions.id, { onDelete: "cascade" }),
    questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "restrict" }),
    selectedOptionId: uuid("selected_option_id").references(() => questionOptions.id),
    freeResponseText: text("free_response_text"),
    isCorrect: boolean("is_correct"),
    timeSpentMs: integer("time_spent_ms"),
    answeredAt: timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_session_answers_session").on(table.sessionId), unique().on(table.sessionId, table.questionId)],
);

export const examResults = pgTable("exam_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull().unique().references(() => examSessions.id, { onDelete: "cascade" }),
  totalQuestions: smallint("total_questions").notNull(),
  correctCount: smallint("correct_count").notNull(),
  wrongCount: smallint("wrong_count").notNull(),
  skippedCount: smallint("skipped_count").notNull().default(0),
  score: numeric("score", { precision: 5, scale: 2, mode: "number" }).notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2, mode: "number" }).notNull(),
  timeSpentSeconds: integer("time_spent_seconds").notNull(),
  subjectBreakdown: jsonb("subject_breakdown")
    .$type<Record<string, { correct: number; total: number; percentage: number }>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Exam = typeof exams.$inferSelect;
export type ExamSession = typeof examSessions.$inferSelect;
export type NewExamSession = typeof examSessions.$inferInsert;
export type SessionAnswer = typeof sessionAnswers.$inferSelect;
export type ExamResult = typeof examResults.$inferSelect;
