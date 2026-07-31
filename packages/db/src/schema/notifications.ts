import { pgTable, uuid, text, jsonb, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

// Mirrors supabase/migrations/0007_notifications_schema.sql.
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    channel: text("channel").notNull(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    payload: jsonb("payload").notNull().default({}),
    isRead: boolean("is_read").notNull().default(false),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_notifications_user_created").on(table.userId, table.createdAt),
    index("idx_notifications_unread").on(table.userId),
  ],
);

export type Notification = typeof notifications.$inferSelect;
