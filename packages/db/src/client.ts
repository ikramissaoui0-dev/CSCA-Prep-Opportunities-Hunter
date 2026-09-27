import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

/**
 * Call once per long-lived process (a Next.js server, an Edge Function
 * cold start) — not per-request. Reuses one connection pool.
 *
 * `prepare: false` is required against Supabase's pooled connection
 * (PgBouncer in transaction mode, per docs/ARCHITECTURE.md's scalability
 * section) — transaction-mode pooling doesn't support prepared
 * statements, and leaving this on causes intermittent "prepared
 * statement already exists" errors under load.
 *
 * `max: 1` — this client is created fresh per serverless function
 * instance (Vercel), not shared across a fleet of long-lived servers.
 * postgres.js defaults to a 10-connection pool per client; with many
 * concurrent Lambda instances each opening up to 10, the pooler's own
 * connection ceiling is exhausted fast, surfacing as sporadic
 * "unexpected error" page crashes right after sign-up (a burst of
 * dashboard queries hitting a cold instance is exactly when this bites).
 * One connection per instance, with the platform's own horizontal
 * scaling providing concurrency instead, is the standard fix for
 * serverless + Postgres per Supabase's own guidance.
 */
export function createDbClient(connectionString: string) {
  const client = postgres(connectionString, { prepare: false, max: 1 });
  return drizzle(client, { schema });
}

// Deliberately PostgresJsDatabase, not ReturnType<typeof createDbClient>:
// the latter includes `$client`, which only the top-level connection has
// — a transaction object doesn't, and lib/db.ts's withRlsContext needs
// this type to accept both interchangeably.
export type Database = PostgresJsDatabase<typeof schema>;
export * from "./schema";
