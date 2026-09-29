import { describe, it, expect } from "vitest";
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth";

describe("signUpSchema", () => {
  const base = {
    fullName: "Jane Student",
    email: "jane@example.com",
    phone: "+212 6 12 34 56 78",
    password: "Str0ngPass!",
    confirmPassword: "Str0ngPass!",
  };

  it("accepts a valid signup", () => {
    expect(signUpSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a password missing a required character class", () => {
    expect(signUpSchema.safeParse({ ...base, password: "alllowercase1", confirmPassword: "alllowercase1" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...base, password: "ALLUPPERCASE1", confirmPassword: "ALLUPPERCASE1" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...base, password: "NoDigitsHere", confirmPassword: "NoDigitsHere" }).success).toBe(false);
  });

  it("rejects a password under 8 characters, even if it meets every character rule", () => {
    expect(signUpSchema.safeParse({ ...base, password: "Ab1defg", confirmPassword: "Ab1defg" }).success).toBe(false);
  });

  it("rejects mismatched password confirmation", () => {
    const result = signUpSchema.safeParse({ ...base, confirmPassword: "Different1!" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(signUpSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a missing or malformed phone number", () => {
    expect(signUpSchema.safeParse({ ...base, phone: "" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...base, phone: "call me maybe" }).success).toBe(false);
  });
});

describe("signInSchema", () => {
  it("only requires a non-empty password, not the full strength policy", () => {
    // Sign-in must accept passwords set before the strength policy
    // existed, or set directly via Supabase — it just checks credentials
    // against what's already stored, unlike sign-up.
    expect(signInSchema.safeParse({ email: "jane@example.com", password: "anything" }).success).toBe(true);
  });

  it("rejects an empty password", () => {
    expect(signInSchema.safeParse({ email: "jane@example.com", password: "" }).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email and rejects an invalid one", () => {
    expect(forgotPasswordSchema.safeParse({ email: "jane@example.com" }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("applies the same strength policy as sign-up", () => {
    expect(resetPasswordSchema.safeParse({ password: "weak", confirmPassword: "weak" }).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ password: "Str0ngPass!", confirmPassword: "Str0ngPass!" }).success).toBe(true);
  });

  it("rejects mismatched confirmation", () => {
    expect(resetPasswordSchema.safeParse({ password: "Str0ngPass!", confirmPassword: "Str0ngPass!!" }).success).toBe(false);
  });
});
