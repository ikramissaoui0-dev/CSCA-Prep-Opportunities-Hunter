import "server-only";

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { serverEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

const redis =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: serverEnv.UPSTASH_REDIS_REST_URL, token: serverEnv.UPSTASH_REDIS_REST_TOKEN })
    : null;

export type RateLimitRule = { requests: number; windowSeconds: number };

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, rule: RateLimitRule): Ratelimit | null {
  if (!redis) return null;
  let limiter = limiters.get(name);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(rule.requests, `${rule.windowSeconds} s`),
      prefix: `ratelimit:${name}`,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

const warnedNames = new Set<string>();
function warnUnconfiguredOnce(name: string) {
  // Once per name per process, not per-request — this fires on every
  // unconfigured environment (local dev included), so per-request
  // logging would just be noise. Still visible enough to notice before
  // a real deployment ships without Upstash configured.
  if (warnedNames.has(name)) return;
  warnedNames.add(name);
  logger.warn({ rateLimitName: name }, "rate_limit_not_configured — allowing all requests through until UPSTASH_REDIS_REST_URL/TOKEN are set");
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/**
 * `name` scopes the limiter (a distinct bucket per action — login vs.
 * contact-form vs. exam-submit), `identifier` scopes the caller within
 * it (user id for authenticated actions, IP for anonymous ones — see
 * getRequestIp below). Degrades to "always allowed" when Upstash isn't
 * configured, the same graceful-unless-actually-used shape as the
 * OpenAI/Stripe/Resend clients — a missing rate limiter should never be
 * the reason a legitimate request fails in local dev.
 */
export async function checkRateLimit(name: string, identifier: string, rule: RateLimitRule): Promise<RateLimitResult> {
  const limiter = getLimiter(name, rule);
  if (!limiter) {
    warnUnconfiguredOnce(name);
    return { allowed: true };
  }

  const result = await limiter.limit(identifier);
  if (result.success) return { allowed: true };
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
}

/**
 * Best-effort caller IP for anonymous rate limiting (login, register,
 * the public contact form) — trusts the first hop's X-Forwarded-For,
 * which is what Vercel's edge network sets. Never used for anything
 * security-critical beyond rate-limit bucketing, where a spoofed IP at
 * worst shares a bucket with someone else, not a privilege escalation.
 */
export async function getRequestIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}
