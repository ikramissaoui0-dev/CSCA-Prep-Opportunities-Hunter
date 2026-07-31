import * as Sentry from "@sentry/nextjs";

/**
 * Next.js's server-startup hook — runs once per runtime (nodejs and
 * edge get separate instances, hence the separate config files) before
 * any request is handled. This is the officially documented place to
 * initialize Sentry for the App Router; it must not do anything else,
 * since it also runs during `next build`'s page-data collection.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures errors from React Server Components (layouts, pages, route
// handlers) that neither app/error.tsx nor app/global-error.tsx ever
// see — those only catch render errors on the client. A no-op call
// when Sentry was never initialized (dsn unset) since captureRequestError
// just reports to whatever client Sentry.init did or didn't create.
export const onRequestError = Sentry.captureRequestError;
