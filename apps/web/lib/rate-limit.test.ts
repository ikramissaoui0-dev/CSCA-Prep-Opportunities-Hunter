import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rate-limit";

// UPSTASH_REDIS_REST_URL/TOKEN are deliberately left unset (see
// vitest.setup.ts) — this exercises the real "not configured" state a
// local dev environment is in, matching the same graceful-degrade
// contract as the OpenAI/Stripe/Resend clients: a missing rate limiter
// must never be the reason a legitimate request fails.
describe("checkRateLimit (Upstash not configured)", () => {
  it("allows every request through rather than blocking", async () => {
    const result = await checkRateLimit("test-bucket", "some-identifier", { requests: 1, windowSeconds: 60 });
    expect(result).toEqual({ allowed: true });
  });

  it("keeps allowing requests past the configured limit — there is no real limiter to enforce it", async () => {
    for (let i = 0; i < 5; i++) {
      const result = await checkRateLimit("test-bucket-repeat", "same-identifier", { requests: 1, windowSeconds: 60 });
      expect(result.allowed).toBe(true);
    }
  });
});
