import * as Sentry from "@sentry/nextjs";

// See sentry.server.config.ts — same no-op-when-unset contract, split
// into its own file only because the Edge runtime (middleware.ts) can't
// import Node-targeted Sentry transports.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}
