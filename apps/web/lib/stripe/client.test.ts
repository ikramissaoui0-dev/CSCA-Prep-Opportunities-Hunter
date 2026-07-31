import { describe, it, expect } from "vitest";
import { planTierForPriceId } from "./client";

// Prices are set to deterministic test values in vitest.setup.ts
// ("price_test_premium" / "price_test_premium_plus").
describe("planTierForPriceId", () => {
  it("maps the configured premium price id to 'premium'", () => {
    expect(planTierForPriceId("price_test_premium")).toBe("premium");
  });

  it("maps the configured premium+ price id to 'premium_plus'", () => {
    expect(planTierForPriceId("price_test_premium_plus")).toBe("premium_plus");
  });

  it("returns null for any unrecognized price id", () => {
    // This is the guard that keeps a misconfigured or unexpected Stripe
    // price from silently granting a plan tier during checkout/webhook
    // processing (lib/billing/checkout-actions-core.ts).
    expect(planTierForPriceId("price_unrelated_product")).toBeNull();
    expect(planTierForPriceId("")).toBeNull();
  });
});
