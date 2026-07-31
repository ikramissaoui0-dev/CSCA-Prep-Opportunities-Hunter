import { z } from "zod";

/** Every write path (grant form, bulk import, the registration trigger in
 * SQL) normalizes an email the same way — this is the app-side mirror of
 * `lower(trim(new.email))` in 0012_student_access_grants.sql. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const grantedTierSchema = z.enum(["premium", "premium_plus"]);
export type GrantedTierInput = z.infer<typeof grantedTierSchema>;

// The client sends a duration *option*, never a raw expires_at — the
// actual date is computed server-side (see access-grants-actions-core.ts)
// so "expiration logic must be enforced server-side" isn't just a
// frontend promise. "custom" is the one option that also carries a
// client-supplied date, still validated (must be in the future) below.
export const expirationOptionSchema = z.enum(["7d", "30d", "3m", "6m", "12m", "permanent", "custom"]);
export type ExpirationOptionInput = z.infer<typeof expirationOptionSchema>;

export const grantAccessSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    grantedTier: grantedTierSchema,
    expirationOption: expirationOptionSchema,
    customExpiresAt: z.string().datetime().optional(),
    adminNote: z.string().trim().max(2000).optional(),
  })
  .refine((data) => data.expirationOption !== "custom" || !!data.customExpiresAt, {
    message: "Choose a custom expiration date",
    path: ["customExpiresAt"],
  })
  .refine((data) => data.expirationOption !== "custom" || new Date(data.customExpiresAt!).getTime() > Date.now(), {
    message: "Expiration date must be in the future",
    path: ["customExpiresAt"],
  });
export type GrantAccessInput = z.infer<typeof grantAccessSchema>;

export const extendAccessSchema = z.object({
  grantId: z.string().uuid(),
  expirationOption: expirationOptionSchema,
  customExpiresAt: z.string().datetime().optional(),
});
export type ExtendAccessInput = z.infer<typeof extendAccessSchema>;

export const revokeAccessSchema = z.object({ grantId: z.string().uuid() });

export const changeAdminNoteSchema = z.object({
  grantId: z.string().uuid(),
  adminNote: z.string().trim().max(2000),
});

// Bulk import row shape — column headers match these keys literally
// (first_name | last_name | email | expiration_date), same convention as
// the existing question bank import (lib/validation/question.ts's
// importRowSchema): the CSV/XLSX header row must spell these exactly.
// expiration_date is optional free text (YYYY-MM-DD or blank) — parsed
// leniently in access-grant-import.ts; blank or unparseable falls back
// to the default 12-month grant, same as the single-grant form's default.
export const accessGrantImportRowSchema = z.object({
  first_name: z.string().trim().max(200).default(""),
  last_name: z.string().trim().max(200).default(""),
  email: z.string().trim().email("Enter a valid email address"),
  expiration_date: z.string().trim().default(""),
});
export type AccessGrantImportRow = z.infer<typeof accessGrantImportRowSchema>;
