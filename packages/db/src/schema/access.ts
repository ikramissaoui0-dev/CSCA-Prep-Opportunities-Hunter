import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, jsonb, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { planTierEnum } from "./commerce";

// Mirrors supabase/migrations/0012_student_access_grants.sql.
// Deliberately its own table, never touching subscriptions/payments —
// billing state (Stripe) and access entitlement state (this) stay
// separate by design. Status (ACTIVE/EXPIRED/PENDING_REGISTRATION) is
// derived at query time (see server/queries/admin-access-grants.ts),
// not stored — only revoked_at is real stored state.
export const studentAccessGrants = pgTable(
  "student_access_grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
    grantedTier: planTierEnum("granted_tier").notNull(),
    grantedBy: uuid("granted_by").notNull().references(() => profiles.id, { onDelete: "restrict" }),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    adminNote: text("admin_note"),
    activationMessageShown: boolean("activation_message_shown").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_student_access_grants_active_email")
      .on(table.email)
      .where(sql`revoked_at is null`),
    index("idx_student_access_grants_user").on(table.userId),
    index("idx_student_access_grants_email").on(table.email),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: uuid("target_id"),
    targetEmail: text("target_email"),
    previousValue: jsonb("previous_value"),
    newValue: jsonb("new_value"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_audit_logs_target").on(table.targetType, table.targetId)],
);

export type StudentAccessGrant = typeof studentAccessGrants.$inferSelect;
export type NewStudentAccessGrant = typeof studentAccessGrants.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
