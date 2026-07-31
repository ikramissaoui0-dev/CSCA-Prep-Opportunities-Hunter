import { describe, it, expect } from "vitest";
import { checkoutPlanSchema } from "./billing";

describe("checkoutPlanSchema", () => {
  it("accepts the two paid plan tiers", () => {
    expect(checkoutPlanSchema.safeParse("premium").success).toBe(true);
    expect(checkoutPlanSchema.safeParse("premium_plus").success).toBe(true);
  });

  it("rejects the free tier and any unknown value — there's nothing to check out for free", () => {
    expect(checkoutPlanSchema.safeParse("free").success).toBe(false);
    expect(checkoutPlanSchema.safeParse("enterprise").success).toBe(false);
    expect(checkoutPlanSchema.safeParse("").success).toBe(false);
  });
});
