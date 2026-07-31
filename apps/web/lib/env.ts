import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"])
    .default("info"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // Monthly-only for now (see docs/ARCHITECTURE.md's Phase 9 note) — one
  // Stripe Price per paid tier. Annual pricing can add a second env var
  // per tier later without touching the checkout code path.
  STRIPE_PRICE_PREMIUM_MONTHLY: z.string().optional(),
  STRIPE_PRICE_PREMIUM_PLUS_MONTHLY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  // Phase 12 — contact form. Both optional: the form degrades to a
  // clear "email us directly" message (see lib/email/contact.ts) rather
  // than throwing, the same way OpenAI/Stripe features do when unset.
  RESEND_API_KEY: z.string().optional(),
  CONTACT_FORM_RECIPIENT_EMAIL: z.string().email().optional(),
  // Phase 13 — rate limiting. Optional: unset means every rate-limited
  // action allows requests through (see lib/rate-limit.ts), which is
  // fine for local dev but must be set before a real deployment.
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // Phase 15 — monitoring. A Sentry DSN is meant to be public (it's
  // embedded in client bundles by design, unlike every other secret in
  // this file) — optional because error tracking must never be a
  // deploy-blocking requirement; see instrumentation.ts/
  // instrumentation-client.ts, both no-ops when this is unset.
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

/**
 * Only ever imported from server-only code (Server Actions, Route Handlers,
 * middleware). Throws at boot if a required var is missing, instead of
 * failing confusingly deep inside a Supabase/Stripe call.
 */
function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error(
      "Invalid server environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid server environment variables — check .env against .env.example");
  }
  return parsed.data;
}

function loadClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
  if (!parsed.success) {
    console.error(
      "Invalid client environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid client environment variables — check .env against .env.example");
  }
  return parsed.data;
}

export const serverEnv = typeof window === "undefined" ? loadServerEnv() : (undefined as never);
export const clientEnv = loadClientEnv();
