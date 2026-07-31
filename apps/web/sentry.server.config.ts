import * as Sentry from "@sentry/nextjs";

// A genuine no-op when unset — error tracking must never be a
// deploy-blocking requirement (same contract as every other optional
// integration in this app: OpenAI, Stripe, Resend, Upstash).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Conservative default — trace volume can be raised once there's a
    // real error budget/cost tolerance to tune it against; capturing
    // everything from day one on an unproven traffic pattern risks a
    // surprise bill more than it adds insight.
    tracesSampleRate: 0.1,
  });
}
