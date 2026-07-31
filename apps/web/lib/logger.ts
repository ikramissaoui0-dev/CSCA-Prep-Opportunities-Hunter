import "server-only";

import pino from "pino";

const isEdgeRuntime = process.env.NEXT_RUNTIME === "edge";
const isDev = process.env.NODE_ENV === "development";

/**
 * Structured logger for Server Actions, Route Handlers, and middleware.
 *
 * pino-pretty (dev-only transport) doesn't work in the Edge runtime, so
 * middleware — which runs on Edge — always gets plain JSON logs. That's a
 * fine trade: JSON is what production log aggregation (Logflare/Grafana)
 * wants anyway, so only local Node-side dev output is affected.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "csca-prep-web" },
  transport:
    isDev && !isEdgeRuntime
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname,service" } }
      : undefined,
});

/**
 * Per-request child logger. Pass a stable requestId (e.g. from a header
 * set in middleware) to correlate every log line for one request across
 * Server Actions, Route Handlers, and Edge Functions.
 */
export function createRequestLogger(requestId: string, extra?: Record<string, unknown>) {
  return logger.child({ requestId, ...extra });
}
