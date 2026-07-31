import "server-only";

import { parseSpreadsheet } from "@/lib/spreadsheet-import";
import { importRowSchema, type ImportRow } from "@/lib/validation/question";

export type ImportRowResult =
  | { row: number; status: "valid"; data: ImportRow }
  | { row: number; status: "error"; message: string; raw: Record<string, string> };

// Defense-in-depth against a pathological upload (accidental or not) —
// nothing here needs more than a few hundred questions per import batch.
const MAX_ROWS = 500;

/**
 * Parses either a .csv or .xlsx buffer into validated question rows.
 * Never throws on bad data — invalid rows come back as `status: "error"`
 * with the reason, so the import page can show a full preview (valid +
 * invalid) before anything is committed.
 */
export async function parseImportFile(file: { name: string; buffer: Buffer }): Promise<ImportRowResult[]> {
  const rawRows = await parseSpreadsheet(file);

  return rawRows.slice(0, MAX_ROWS).map((raw, index) => {
    const parsed = importRowSchema.safeParse(raw);
    // +2: row 1 is the header, so the first data row is spreadsheet row 2 —
    // matches what the user would see if they opened the file themselves.
    const row = index + 2;
    if (!parsed.success) {
      return { row, status: "error" as const, message: parsed.error.issues[0]?.message ?? "Invalid row", raw };
    }
    return { row, status: "valid" as const, data: parsed.data };
  });
}
