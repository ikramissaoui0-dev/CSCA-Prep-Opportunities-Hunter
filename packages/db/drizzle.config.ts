import { defineConfig } from "drizzle-kit";

/**
 * NOT used to generate or run migrations — `supabase/migrations/*.sql`
 * is the single source of truth for schema, RLS policies, triggers, and
 * the auth hook, none of which Drizzle's schema DSL can express. This
 * config exists only so `drizzle-kit studio` (a nice local data browser)
 * and `drizzle-kit introspect` (checking src/schema/*.ts hasn't drifted
 * from the real database) have something to point at.
 */
export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./.drizzle-introspect",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
