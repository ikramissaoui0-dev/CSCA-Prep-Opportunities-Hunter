import "server-only";

import { sql } from "drizzle-orm";
import type { PlanTier } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

/**
 * Calls the Postgres function directly (0005_learning_schema.sql) rather
 * than re-deriving "latest active/trialing subscription, else free" in
 * TypeScript — that logic already has exactly one authoritative home,
 * the same function every RLS policy gating courses/lessons calls, and
 * duplicating it here would just be a second place for the two to drift.
 * Not security-definer, so this only ever sees what the caller's own
 * subscriptions_owner_read policy allows — i.e. their own plan.
 */
export async function getCurrentPlanTier(userId: string, role: UserRole): Promise<PlanTier> {
  return withRlsContext(userId, role, async (tx) => {
    const rows = await tx.execute<{ tier: PlanTier }>(sql`select public.current_user_plan_tier() as tier`);
    return rows[0]!.tier;
  });
}

export function planTierAtLeast(tier: PlanTier, minimum: PlanTier): boolean {
  const rank: Record<PlanTier, number> = { free: 0, premium: 1, premium_plus: 2 };
  return rank[tier] >= rank[minimum];
}
