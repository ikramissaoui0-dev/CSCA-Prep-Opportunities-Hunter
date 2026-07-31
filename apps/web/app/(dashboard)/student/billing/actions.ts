"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { createCheckoutSessionCore, createBillingPortalSessionCore } from "@/lib/billing/checkout-actions-core";
import { checkoutPlanSchema, type CheckoutPlan } from "@/lib/validation/billing";
import { checkRateLimit } from "@/lib/rate-limit";

export async function startCheckout(plan: CheckoutPlan): Promise<ActionResult<never> | undefined> {
  const parsed = checkoutPlanSchema.safeParse(plan);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Unknown plan."));
  }
  const user = await requireUser();
  const rateLimit = await checkRateLimit("billing-checkout", user.id, { requests: 5, windowSeconds: 600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED"));
  }
  const result = await createCheckoutSessionCore(user, parsed.data);
  if (!result.success) {
    return result;
  }
  redirect(result.data.url);
}

export async function openBillingPortal(): Promise<ActionResult<never> | undefined> {
  const user = await requireUser();
  const rateLimit = await checkRateLimit("billing-portal", user.id, { requests: 10, windowSeconds: 600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED"));
  }
  const result = await createBillingPortalSessionCore(user);
  if (!result.success) {
    return result;
  }
  redirect(result.data.url);
}
