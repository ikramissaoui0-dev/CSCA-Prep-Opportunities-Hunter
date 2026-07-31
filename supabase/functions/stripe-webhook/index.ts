// Phase 9 — Stripe webhook. Per docs/ARCHITECTURE.md's Phase 9 design,
// this lives in a Supabase Edge Function (not a Next.js Route Handler)
// so the Stripe secret key and webhook signing secret never enter the
// Vercel/Next.js server bundle at all. This is the *only* thing allowed
// to write `subscriptions`/`payments` — both tables have no insert/update
// policy for `authenticated` (see 0004_commerce_schema.sql) precisely so
// that a client can never fake its own plan upgrade.
//
// Deploy: `supabase functions deploy stripe-webhook`
// Secrets: `supabase secrets set STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=...
//           STRIPE_PRICE_PREMIUM_MONTHLY=... STRIPE_PRICE_PREMIUM_PLUS_MONTHLY=...`
//          (separate from apps/web/.env.local — Edge Function secrets are
//          their own store, set via the Supabase CLI/dashboard, not read
//          from the Next.js app's environment.)
// Stripe Dashboard: add an endpoint at
//          https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//          listening for checkout.session.completed, customer.subscription.*,
//          invoice.paid, invoice.payment_failed.
// Local testing: `stripe listen --forward-to <local-functions-url>/stripe-webhook`
//          prints a webhook secret to use as STRIPE_WEBHOOK_SECRET locally.

import Stripe from "npm:stripe@18";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const pricePremiumMonthly = Deno.env.get("STRIPE_PRICE_PREMIUM_MONTHLY");
const pricePremiumPlusMonthly = Deno.env.get("STRIPE_PRICE_PREMIUM_PLUS_MONTHLY");

if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
  console.error("stripe-webhook: missing required secrets — see this file's header comment for the `supabase secrets set` command.");
}

const stripe = new Stripe(stripeSecretKey ?? "", {
  // Deno has no Node `crypto` module, and the SDK's default HTTP client
  // assumes Node — both must be swapped for their Web-standard/Deno
  // equivalents, which is why signature verification below uses
  // constructEventAsync (SubtleCrypto-based) instead of the sync version.
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(supabaseUrl ?? "", serviceRoleKey ?? "");

type PlanTier = "premium" | "premium_plus";

function planTierForPrice(priceId: string | undefined | null): PlanTier | null {
  if (!priceId) return null;
  if (priceId === pricePremiumMonthly) return "premium";
  if (priceId === pricePremiumPlusMonthly) return "premium_plus";
  return null;
}

/**
 * Both places a subscription's owner can be recovered: the metadata set
 * at checkout time (subscription_data.metadata.user_id in
 * createCheckoutSessionCore) survives onto the Subscription object
 * itself, so this works for every event type, not just the one
 * checkout.session.completed event that also carries client_reference_id.
 */
function userIdFromSubscription(subscription: Stripe.Subscription): string | null {
  return subscription.metadata?.user_id ?? null;
}

async function upsertSubscriptionRow(subscription: Stripe.Subscription, userId: string) {
  const item = subscription.items.data[0];
  const priceId = item?.price.id;
  const planTier = planTierForPrice(priceId);
  if (!planTier) {
    console.error(`stripe-webhook: subscription ${subscription.id} has unrecognized price ${priceId} — skipping.`);
    return;
  }

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_tier: planTier,
      status: subscription.status,
      stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      current_period_start: new Date(item!.current_period_start * 1000).toISOString(),
      current_period_end: new Date(item!.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw error;
}

async function recordPaymentFromInvoice(invoice: Stripe.Invoice, status: "succeeded" | "failed", eventId: string) {
  // As of the API version this SDK targets, invoices no longer carry a
  // top-level `subscription`/`payment_intent` field (Stripe moved that
  // under `parent.subscription_details` and the separate Invoice
  // Payments resource, respectively — a genuinely recent restructuring).
  // subscription_details.metadata is an immutable snapshot of the
  // subscription's metadata taken at invoice finalization, so `user_id`
  // is readable straight off the invoice with no extra API round-trip.
  const subscriptionDetails = invoice.parent?.subscription_details;
  const subscriptionRef = subscriptionDetails?.subscription;
  const subscriptionId = typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef?.id;
  const userId = subscriptionDetails?.metadata?.user_id ?? null;
  if (!subscriptionId || !userId) {
    console.error(`stripe-webhook: invoice ${invoice.id} — couldn't resolve subscription/user_id.`);
    return;
  }

  const { data: localSub } = await supabase.from("subscriptions").select("id").eq("stripe_subscription_id", subscriptionId).maybeSingle();

  // ignoreDuplicates on stripe_event_id: Stripe retries webhook delivery
  // on anything but a fast 2xx, so the exact same event can arrive twice
  // — this is what makes replays a no-op instead of a duplicate charge
  // record (see 0004_commerce_schema.sql's comment on that column).
  const { error } = await supabase.from("payments").upsert(
    {
      user_id: userId,
      subscription_id: localSub?.id ?? null,
      // invoice.id substitutes for a payment_intent id here — see the
      // comment above on why the direct field no longer exists on the
      // invoice object. It's still globally unique per invoice, which is
      // all this column is actually relied on for (display + a stable
      // dedupe key alongside stripe_event_id).
      stripe_payment_intent_id: invoice.id,
      // The actual webhook event id (evt_xxx) — this is what Stripe
      // retries under, so this is the correct replay-dedupe key (see
      // 0004_commerce_schema.sql's comment on this column), not invoice.id.
      stripe_event_id: eventId,
      amount_cents: invoice.amount_paid || invoice.amount_due,
      currency: invoice.currency,
      status,
      description: invoice.lines.data[0]?.description ?? null,
    },
    { onConflict: "stripe_event_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature || !webhookSecret) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const userId = session.client_reference_id;
        if (!userId) {
          console.error(`stripe-webhook: checkout session ${session.id} has no client_reference_id — can't attribute it to a user.`);
          break;
        }

        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertSubscriptionRow(subscription, userId);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = userIdFromSubscription(subscription);
        if (!userId) {
          console.error(`stripe-webhook: subscription ${subscription.id} update has no user_id metadata.`);
          break;
        }
        await upsertSubscriptionRow(subscription, userId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);
        if (error) throw error;
        break;
      }

      case "invoice.paid": {
        await recordPaymentFromInvoice(event.data.object as Stripe.Invoice, "succeeded", event.id);
        break;
      }

      case "invoice.payment_failed": {
        await recordPaymentFromInvoice(event.data.object as Stripe.Invoice, "failed", event.id);
        break;
      }

      default:
        // Unhandled event types are acknowledged, not errors — Stripe's
        // dashboard sends whatever the endpoint is subscribed to, and
        // silently ignoring the rest is correct, not a bug to fix.
        break;
    }
  } catch (err) {
    console.error(`stripe-webhook: failed to process ${event.type} (${event.id})`, err);
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
});
