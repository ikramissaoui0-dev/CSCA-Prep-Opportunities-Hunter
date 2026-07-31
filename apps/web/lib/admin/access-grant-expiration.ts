import type { ExpirationOptionInput } from "@/lib/validation/access-grants";

/**
 * Pure date arithmetic, hand-rolled rather than adding a date library —
 * this app has no other date-math dependency (see lib/exam/timing.ts for
 * the same reasoning). `from` defaults to "now" but takes an explicit
 * value so extending an *already-expired* grant can be tested/reasoned
 * about deterministically instead of depending on wall-clock time.
 */
export function computeExpiresAt(
  option: ExpirationOptionInput,
  customExpiresAt: string | undefined,
  from: Date = new Date(),
): Date | null {
  switch (option) {
    case "permanent":
      return null;
    case "custom":
      // Validated as "must be in the future" at the zod schema layer
      // (relative to submit time) — not re-validated here, since `from`
      // may legitimately be a past reference point for testing.
      return new Date(customExpiresAt!);
    case "7d":
      return addDays(from, 7);
    case "30d":
      return addDays(from, 30);
    case "3m":
      return addMonths(from, 3);
    case "6m":
      return addMonths(from, 6);
    case "12m":
      return addMonths(from, 12);
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

export const EXPIRING_SOON_WINDOW_DAYS = 30;
