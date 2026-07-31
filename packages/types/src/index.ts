// Shared across apps/web and packages/db. Must stay in lockstep with the
// `user_role` enum in supabase/migrations/0001_auth_foundation.sql — that
// SQL migration is the source of truth; this is its TypeScript mirror.
export const USER_ROLES = ["student", "admin", "content_manager"] as const;
export type UserRole = (typeof USER_ROLES)[number];
