import "server-only";

import { eq, desc } from "drizzle-orm";
import { subscriptions, payments } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";
import { countFullMockAttemptsThisMonth, FREE_FULL_MOCK_MONTHLY_LIMIT } from "@/lib/exam/plan-limits";
import { getCurrentPlanTier } from "@/lib/billing/plan";

export type SubscriptionOverview = {
  status: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
} | null;

export type PaymentHistoryRow = {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: Date;
};

export type BillingOverview = {
  planTier: "free" | "premium" | "premium_plus";
  subscription: SubscriptionOverview;
  payments: PaymentHistoryRow[];
  fullMockUsedThisMonth: number;
  fullMockMonthlyLimit: number;
};

export async function getBillingOverview(userId: string, role: UserRole): Promise<BillingOverview> {
  const [planTier, subscriptionRows, paymentRows, fullMockUsedThisMonth] = await Promise.all([
    getCurrentPlanTier(userId, role),

    withRlsContext(userId, role, (tx) =>
      tx
        .select({ status: subscriptions.status, currentPeriodEnd: subscriptions.currentPeriodEnd, cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd })
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(desc(subscriptions.currentPeriodEnd))
        .limit(1),
    ),

    withRlsContext(userId, role, (tx) =>
      tx
        .select({
          id: payments.id,
          amountCents: payments.amountCents,
          currency: payments.currency,
          status: payments.status,
          description: payments.description,
          createdAt: payments.createdAt,
        })
        .from(payments)
        .where(eq(payments.userId, userId))
        .orderBy(desc(payments.createdAt))
        .limit(20),
    ),

    withRlsContext(userId, role, (tx) => countFullMockAttemptsThisMonth(tx, userId)),
  ]);

  return {
    planTier,
    subscription: subscriptionRows[0] ?? null,
    payments: paymentRows,
    fullMockUsedThisMonth,
    fullMockMonthlyLimit: FREE_FULL_MOCK_MONTHLY_LIMIT,
  };
}
