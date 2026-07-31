import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./contact";

const valid = { name: "Jane Student", email: "jane@example.com", message: "I have a question about pricing." };

describe("contactFormSchema", () => {
  it("accepts a well-formed submission with no honeypot value", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a message under 10 characters (deters one-word spam/probe submissions)", () => {
    expect(contactFormSchema.safeParse({ ...valid, message: "hi" }).success).toBe(false);
  });

  it("rejects a name under 2 characters or an invalid email", () => {
    expect(contactFormSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects any non-empty honeypot value — the whole point of the field", () => {
    // A real visitor never sees or fills this field; anything in it is
    // exactly what should fail validation (see the honeypot's own
    // comment and the submit action's handling of a *valid empty* one).
    expect(contactFormSchema.safeParse({ ...valid, website: "https://spam.example" }).success).toBe(false);
  });

  it("accepts a submission with the honeypot omitted or empty", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...valid, website: "" }).success).toBe(true);
  });
});
