import { describe, it, expect } from "vitest";
import { computeExpiresAt } from "./access-grant-expiration";

const FIXED_NOW = new Date("2026-01-15T00:00:00.000Z");

describe("computeExpiresAt", () => {
  it("returns null for 'permanent' — no expiration at all", () => {
    expect(computeExpiresAt("permanent", undefined, FIXED_NOW)).toBeNull();
  });

  it("adds each documented duration correctly", () => {
    expect(computeExpiresAt("7d", undefined, FIXED_NOW)?.toISOString()).toBe("2026-01-22T00:00:00.000Z");
    expect(computeExpiresAt("30d", undefined, FIXED_NOW)?.toISOString()).toBe("2026-02-14T00:00:00.000Z");
    expect(computeExpiresAt("3m", undefined, FIXED_NOW)?.toISOString()).toBe("2026-04-15T00:00:00.000Z");
    expect(computeExpiresAt("6m", undefined, FIXED_NOW)?.toISOString()).toBe("2026-07-15T00:00:00.000Z");
    expect(computeExpiresAt("12m", undefined, FIXED_NOW)?.toISOString()).toBe("2027-01-15T00:00:00.000Z");
  });

  it("uses the given custom date verbatim", () => {
    const custom = "2028-06-01T00:00:00.000Z";
    expect(computeExpiresAt("custom", custom, FIXED_NOW)?.toISOString()).toBe(custom);
  });
});
