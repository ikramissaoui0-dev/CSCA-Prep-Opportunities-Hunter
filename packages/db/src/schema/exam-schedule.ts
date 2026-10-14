import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core";

// Mirrors supabase/migrations/0020_exam_schedule_sync.sql. Synced from
// csca.cn's own homepage data feed by a Vercel Cron job — see
// apps/web/app/api/cron/sync-exam-schedule/route.ts.
export const examScheduleSessions = pgTable("exam_schedule_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: text("source_id").notNull().unique(),
  examStart: date("exam_start", { mode: "string" }).notNull(),
  examEnd: date("exam_end", { mode: "string" }).notNull(),
  signupStart: timestamp("signup_start", { withTimezone: true }),
  signupEnd: timestamp("signup_end", { withTimezone: true }),
  signupTextRaw: text("signup_text_raw"),
  statusZh: text("status_zh"),
  statusEn: text("status_en"),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ExamScheduleSession = typeof examScheduleSessions.$inferSelect;
export type NewExamScheduleSession = typeof examScheduleSessions.$inferInsert;
