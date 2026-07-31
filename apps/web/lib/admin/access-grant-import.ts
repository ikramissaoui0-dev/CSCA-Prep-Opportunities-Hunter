import "server-only";

import { auditLogs } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { type ActionResult } from "@/lib/errors";
import { parseSpreadsheet } from "@/lib/spreadsheet-import";
import {
  accessGrantImportRowSchema,
  normalizeEmail,
  type AccessGrantImportRow,
  type ExpirationOptionInput,
  type GrantedTierInput,
} from "@/lib/validation/access-grants";
import { findUserIdByEmail, grantFreeAccessCore } from "./access-grants-actions-core";

// Defense-in-depth against a pathological upload — matches the question
// bank import's own ceiling (lib/question-import.ts), scaled up slightly
// since a cohort roster is plausibly larger than a question batch.
const MAX_ROWS = 1000;

export type AccessGrantImportPreviewRow =
  | { row: number; status: "valid"; data: AccessGrantImportRow; accountStatus: "existing" | "new"; isDuplicateInFile: boolean }
  | { row: number; status: "error"; message: string; raw: Record<string, string> };

/**
 * Preview only — never writes anything. The import page shows this in
 * full (valid rows, their account/duplicate status, and every error) so
 * an admin can review before committing; nothing here silently discards
 * a bad row, it's just marked as an error for commitAccessGrantImportCore
 * to skip later.
 */
export async function parseAccessGrantImportFile(file: { name: string; buffer: Buffer }): Promise<AccessGrantImportPreviewRow[]> {
  const rawRows = await parseSpreadsheet(file);
  const seenEmails = new Set<string>();
  const results: AccessGrantImportPreviewRow[] = [];

  for (const [index, raw] of rawRows.slice(0, MAX_ROWS).entries()) {
    // +2: row 1 is the header, so the first data row is spreadsheet row 2.
    const row = index + 2;
    const parsed = accessGrantImportRowSchema.safeParse(raw);
    if (!parsed.success) {
      results.push({ row, status: "error", message: parsed.error.issues[0]?.message ?? "Invalid row", raw });
      continue;
    }

    const email = normalizeEmail(parsed.data.email);
    const isDuplicateInFile = seenEmails.has(email);
    seenEmails.add(email);
    const matchedUserId = await findUserIdByEmail(db, email);

    results.push({ row, status: "valid", data: parsed.data, accountStatus: matchedUserId ? "existing" : "new", isDuplicateInFile });
  }

  return results;
}

/**
 * A per-row `expiration_date` cell wins if it's present and parses to a
 * real future date; otherwise the batch-level default applies. A bad
 * date string never fails the row outright — only its expiration falls
 * back — matching "never silently discard invalid records" for the row
 * as a whole while still being lenient about a typo'd date cell.
 */
function resolveRowExpiration(
  expirationDateCell: string,
  defaultOption: ExpirationOptionInput,
): { option: ExpirationOptionInput; customExpiresAt?: string } {
  if (!expirationDateCell) return { option: defaultOption };
  const parsed = new Date(expirationDateCell);
  if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
    return { option: defaultOption };
  }
  return { option: "custom", customExpiresAt: parsed.toISOString() };
}

export type AccessGrantImportSummary = { created: number; updated: number; duplicatesSkipped: number; errors: number };

/**
 * Re-validates every row server-side rather than trusting the client's
 * round-trip of "rows I was previously told were valid" — same posture
 * as the question bank's commitBulkImportCore. The row shape
 * (first_name | last_name | email | expiration_date) has no per-row
 * tier column, so `defaultGrantedTier` — chosen once on the import page
 * — applies to the whole batch.
 */
export async function commitAccessGrantImportCore(
  admin: SessionUser,
  rows: AccessGrantImportRow[],
  defaultGrantedTier: GrantedTierInput,
  defaultExpirationOption: ExpirationOptionInput,
): Promise<ActionResult<AccessGrantImportSummary>> {
  const summary: AccessGrantImportSummary = { created: 0, updated: 0, duplicatesSkipped: 0, errors: 0 };
  const seenEmails = new Set<string>();

  for (const rawRow of rows) {
    const parsed = accessGrantImportRowSchema.safeParse(rawRow);
    if (!parsed.success) {
      summary.errors++;
      continue;
    }

    const email = normalizeEmail(parsed.data.email);
    if (seenEmails.has(email)) {
      summary.duplicatesSkipped++;
      continue;
    }
    seenEmails.add(email);

    const { option, customExpiresAt } = resolveRowExpiration(parsed.data.expiration_date, defaultExpirationOption);

    const result = await grantFreeAccessCore(admin, {
      email,
      grantedTier: defaultGrantedTier,
      expirationOption: option,
      customExpiresAt,
    });

    if (!result.success) {
      summary.errors++;
    } else if (result.data.wasExisting) {
      summary.updated++;
    } else {
      summary.created++;
    }
  }

  await db.insert(auditLogs).values({
    actorId: admin.id,
    action: "bulk_import_performed",
    targetType: "student_access_grant",
    newValue: { ...summary, totalRows: rows.length },
  });

  return { success: true, data: summary };
}
