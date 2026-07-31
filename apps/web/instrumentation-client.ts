import * as Sentry from "@sentry/nextjs";

// Next.js 15.3+'s dedicated convention for client-side instrumentation
// (replaces the older sentry.client.config.ts pattern) — loaded
// automatically before the app starts hydrating. Same no-op-when-unset
// contract as the server/edge configs.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}
