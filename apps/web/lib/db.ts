import "server-only";

import { sql } from "drizzle-orm";
import { createDbClient, type Database } from "@csca/db";
import type { UserRole } from "@csca/types";
import { serverEnv } from "@/lib/env";

// Stashed on globalThis so Next.js dev-mode HMR reuses the same
// connection pool across module reloads instead of leaking a new one
// every time a server file changes.
declare global {
  var __cscaDb: Database | undefined;
}

/**
 * Raw connection, authenticated as the Postgres role in DATABASE_URL
 * (not `authenticated`) — this bypasses RLS entirely, the same way a
 * table owner always does. Reserve this for genuinely trusted
 * server-only work that must act across users by design (admin
 * analytics, webhooks, batch jobs). Anything scoped to one user's own
 * data should go through `withRlsContext` instead — see its docstring
 * for why.
 */
export const db: Database = globalThis.__cscaDb ?? createDbClient(serverEnv.DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalThis.__cscaDb = db;
}

/**
 * Runs `fn` inside a transaction with the session's role and JWT claims
 * set to match a real request through Supabase's own PostgREST/Auth
 * path — so every RLS policy in supabase/migrations/*.sql applies
 * exactly as it would there, and Drizzle is just a faster, typed way to
 * issue the query, not a way around RLS.
 *
 * This is the load-bearing reason `packages/db` is a typed *query*
 * client and not a migration tool (docs/ARCHITECTURE.md): RLS is the
 * actual security boundary, and this function is what makes Drizzle
 * queries respect it instead of quietly running as the Postgres
 * superuser. Use this for any query scoped to one user's own data —
 * an explicit `where(eq(table.userId, userId))` is still worth writing
 * for clarity and to fail closed rather than open, but RLS here is what
 * actually stops a forgotten filter from leaking another student's rows.
 */
export async function withRlsContext<T>(userId: string, role: UserRole, fn: (tx: Database) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const claims = JSON.stringify({ sub: userId, user_role: role });
    await tx.execute(sql`select set_config('request.jwt.claims', ${claims}, true)`);
    await tx.execute(sql`set local role authenticated`);
    return fn(tx);
  });
}
