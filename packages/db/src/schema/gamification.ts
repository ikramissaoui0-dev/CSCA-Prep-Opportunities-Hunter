import { pgTable, pgView, uuid, text, integer, bigint, timestamp, primaryKey, index } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

// Mirrors supabase/migrations/0006_gamification_schema.sql.

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    achievementId: uuid("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.achievementId] }),
    index("idx_user_achievements_user").on(table.userId),
  ],
);

export const pointsLedger = pgTable(
  "points_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    points: integer("points").notNull(),
    sourceType: text("source_type").notNull(),
    sourceId: uuid("source_id"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_points_ledger_user").on(table.userId)],
);

// profiles_public: deliberately owner-run (not security_invoker), so it
// can see every user's row without loosening profiles' own "read only
// your own row" RLS — see this view's comment in the migration.
export const profilesPublicView = pgView("profiles_public", {
  id: uuid("id").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
}).existing();

// leaderboard: security_invoker = true — points_ledger already grants
// every row to `authenticated`, so this just runs as the caller. rank
// and total_points come from dense_rank()/sum() in the view definition,
// hence bigint/numeric modes rather than the plain integer columns on
// the underlying tables.
export const leaderboardView = pgView("leaderboard", {
  userId: uuid("user_id").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  totalPoints: bigint("total_points", { mode: "number" }).notNull(),
  rank: bigint("rank", { mode: "number" }).notNull(),
}).existing();

export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type PointsLedgerEntry = typeof pointsLedger.$inferSelect;
export type NewPointsLedgerEntry = typeof pointsLedger.$inferInsert;
