import "server-only";

import Stripe from "stripe";
import { serverEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";

let cachedClient: Stripe | undefined;

/**
 * Same lazy-singleton shape as lib/ai/client.ts's getClient() — Stripe is
 * genuinely optional at boot (a dev environment with no Stripe account
 * yet shouldn't crash the whole app), so this throws only when a billing
 * action is actually invoked, not at import time.
 */
export function getStripeClient(): Stripe {
  if (!serverEnv.STRIPE_SECRET_KEY) {
    throw new AppError("PROVIDER_ERROR", "Billing isn't configured on this server yet.");
  }
  if (!cachedClient) {
    cachedClient = new Stripe(serverEnv.STRIPE_SECRET_KEY);
  }
  return cachedClient;
}

/**
 * The one place a Stripe Price id is resolved to a plan_tier and back —
 * every other call site (checkout, webhook) goes through this instead of
 * comparing raw price strings, so adding an annual price later means
 * touching only this map.
 */
export const PLAN_TIER_PRICE_IDS: Record<"premium" | "premium_plus", string | undefined> = {
  premium: serverEnv.STRIPE_PRICE_PREMIUM_MONTHLY,
  premium_plus: serverEnv.STRIPE_PRICE_PREMIUM_PLUS_MONTHLY,
};

export function planTierForPriceId(priceId: string): "premium" | "premium_plus" | null {
  if (priceId === PLAN_TIER_PRICE_IDS.premium) return "premium";
  if (priceId === PLAN_TIER_PRICE_IDS.premium_plus) return "premium_plus";
  return null;
}
