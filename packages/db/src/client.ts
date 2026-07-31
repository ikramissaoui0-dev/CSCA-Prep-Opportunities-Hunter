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
 */
export function createDbClient(connectionString: string) {
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

// Deliberately PostgresJsDatabase, not ReturnType<typeof createDbClient>:
// the latter includes `$client`, which only the top-level connection has
// — a transaction object doesn't, and lib/db.ts's withRlsContext needs
// this type to accept both interchangeably.
export type Database = PostgresJsDatabase<typeof schema>;
export * from "./schema";
