import { pgTable, pgView, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { USER_ROLES } from "@csca/types";

// Mirrors supabase/migrations/0001_auth_foundation.sql. That SQL file is
// authoritative — if they drift, run `npm run introspect -w packages/db`
// and reconcile by hand (RLS/triggers/grants live only in the SQL).
export const userRoleEnum = pgEnum("user_role", USER_ROLES);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    fullName: text("full_name"),
    // Collected at signup (lib/validation/auth.ts's signUpSchema makes it
    // required there) — nullable here so a pre-existing row, or a future
    // non-password sign-in path with nothing to give, never breaks.
    phone: text("phone"),
    role: userRoleEnum("role").notNull().default("student"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_profiles_role").on(table.role)],
);

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

// Mirrors the admin_user_directory view from 0010_admin_user_directory.sql
// (last_sign_in_at added in 0012_student_access_grants.sql) — read-only,
// and only ever returns rows to an admin caller (the view's own WHERE
// clause enforces that, not table RLS). `.existing()` tells Drizzle to
// only ever SELECT from it, never try to create or alter it.
export const adminUserDirectoryView = pgView("admin_user_directory", {
  id: uuid("id").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: userRoleEnum("role").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
}).existing();
