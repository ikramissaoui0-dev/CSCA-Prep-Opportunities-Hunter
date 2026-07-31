import "server-only";

import { eq, desc } from "drizzle-orm";
import { subscriptions } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { withRlsContext } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { serverEnv } from "@/lib/env";
import { getStripeClient, PLAN_TIER_PRICE_IDS } from "@/lib/stripe/client";
import type { CheckoutPlan } from "@/lib/validation/billing";

/**
 * No pre-created Stripe customer here — Checkout creates one itself from
 * `customer_email` on first purchase, and the webhook (which is the only
 * thing ever allowed to write `subscriptions`, per 0004_commerce_schema.sql)
 * persists the resulting stripe_customer_id once checkout.session.completed
 * arrives. `client_reference_id` + subscription_data.metadata are the two
 * places the webhook can recover `user_id` from — belt and suspenders,
 * since the metadata is what survives onto every later
 * customer.subscription.* event, while client_reference_id only appears
 * on the checkout.session.completed event itself.
 */
export async function createCheckoutSessionCore(user: SessionUser, plan: CheckoutPlan): Promise<ActionResult<{ url: string }>> {
  const priceId = PLAN_TIER_PRICE_IDS[plan];
  if (!priceId) {
    return actionFailure(new AppError("PROVIDER_ERROR", "Billing isn't configured for that plan yet."));
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      subscription_data: { metadata: { user_id: user.id } },
      success_url: `${serverEnv.NEXT_PUBLIC_SITE_URL}/student/billing?checkout=success`,
      cancel_url: `${serverEnv.NEXT_PUBLIC_SITE_URL}/student/billing?checkout=cancelled`,
    });

    if (!session.url) {
      return actionFailure(new AppError("PROVIDER_ERROR"));
    }
    return { success: true, data: { url: session.url } };
  } catch (error) {
    return actionFailure(new AppError("PROVIDER_ERROR", undefined, { cause: error }));
  }
}

/**
 * The portal needs an existing Stripe customer, which only exists once a
 * checkout has completed at least once — including a canceled
 * subscription's customer, so someone can still see past invoices or
 * resubscribe from the portal itself.
 */
export async function createBillingPortalSessionCore(user: SessionUser): Promise<ActionResult<{ url: string }>> {
  const [existing] = await withRlsContext(user.id, user.role, (tx) =>
    tx
      .select({ stripeCustomerId: subscriptions.stripeCustomerId })
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1),
  );

  if (!existing) {
    return actionFailure(new AppError("VALIDATION_ERROR", "You don't have a billing account yet — subscribe to a plan first."));
  }

  try {
    const stripe = getStripeClient();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: existing.stripeCustomerId,
      return_url: `${serverEnv.NEXT_PUBLIC_SITE_URL}/student/billing`,
    });
    return { success: true, data: { url: portalSession.url } };
  } catch (error) {
    return actionFailure(new AppError("PROVIDER_ERROR", undefined, { cause: error }));
  }
}
