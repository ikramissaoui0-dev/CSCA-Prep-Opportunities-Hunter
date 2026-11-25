import { describe, it, expect } from "vitest";
import { normalizeEmail, grantAccessSchema, accessGrantImportRowSchema, expirationOptionSchema } from "./access-grants";

describe("normalizeEmail", () => {
  it("lowercases and trims — the same normalization the DB trigger applies at signup", () => {
    expect(normalizeEmail("  Student@Example.COM  ")).toBe("student@example.com");
  });

  it("treats case/whitespace variants of the same address as identical", () => {
    // Scenario 12: a duplicate/case-variant email must resolve to the
    // same grant, never a second one.
    expect(normalizeEmail("Jane.Doe@Example.com")).toBe(normalizeEmail(" jane.doe@example.com "));
  });
});

describe("grantAccessSchema", () => {
  const base = { email: "student@example.com", grantedTier: "premium_plus" as const, expirationOption: "12m" as const };

  it("accepts a standard grant with a duration option and no custom date", () => {
    expect(grantAccessSchema.safeParse(base).success).toBe(true);
  });

  it("accepts 'permanent' with no expiration date at all", () => {
    expect(grantAccessSchema.safeParse({ ...base, expirationOption: "permanent" }).success).toBe(true);
  });

  it("requires a customExpiresAt when expirationOption is 'custom'", () => {
    expect(grantAccessSchema.safeParse({ ...base, expirationOption: "custom" }).success).toBe(false);
  });

  it("rejects a custom expiration date in the past", () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(grantAccessSchema.safeParse({ ...base, expirationOption: "custom", customExpiresAt: pastDate }).success).toBe(false);
  });

  it("accepts a custom expiration date in the future", () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(grantAccessSchema.safeParse({ ...base, expirationOption: "custom", customExpiresAt: futureDate }).success).toBe(true);
  });

  it("rejects an invalid email or an unknown tier", () => {
    expect(grantAccessSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
    expect(grantAccessSchema.safeParse({ ...base, grantedTier: "free" }).success).toBe(false);
  });

  it("phone is optional — informational only, not part of the identity match", () => {
    expect(grantAccessSchema.safeParse(base).success).toBe(true);
    expect(grantAccessSchema.safeParse({ ...base, phone: "+216 12 345 678" }).success).toBe(true);
  });

  it("first/last name are optional — just a display fallback before the student registers", () => {
    expect(grantAccessSchema.safeParse(base).success).toBe(true);
    expect(grantAccessSchema.safeParse({ ...base, firstName: "Jane", lastName: "Doe" }).success).toBe(true);
  });
});

describe("expirationOptionSchema", () => {
  it("accepts every documented duration plus permanent and custom", () => {
    for (const option of ["7d", "30d", "3m", "6m", "12m", "permanent", "custom"]) {
      expect(expirationOptionSchema.safeParse(option).success).toBe(true);
    }
  });

  it("rejects an option not in that list", () => {
    expect(expirationOptionSchema.safeParse("1y").success).toBe(false);
  });
});

describe("accessGrantImportRowSchema", () => {
  it("accepts a row with all four columns, matching the documented header names", () => {
    const result = accessGrantImportRowSchema.safeParse({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane@example.com",
      expiration_date: "2027-01-31",
    });
    expect(result.success).toBe(true);
  });

  it("only requires email — name, phone, and expiration_date default to empty", () => {
    const result = accessGrantImportRowSchema.safeParse({ email: "jane@example.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.first_name).toBe("");
      expect(result.data.phone).toBe("");
      expect(result.data.expiration_date).toBe("");
    }
  });

  it("rejects a row with an invalid email", () => {
    expect(accessGrantImportRowSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});
