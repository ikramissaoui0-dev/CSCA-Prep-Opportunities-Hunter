import "server-only";

import ExcelJS from "exceljs";

/**
 * Shared by every bulk-import feature (question bank, student access
 * grants, ...) — parses a .csv or .xlsx buffer into raw string-keyed
 * rows, with no knowledge of what the columns mean. Each feature layers
 * its own zod schema on top of this.
 */

/**
 * Minimal RFC4180-ish CSV parser: quoted fields, embedded commas/newlines,
 * `""` as an escaped quote. Written by hand instead of adding a
 * dependency — the `xlsx` (SheetJS) package has unpatched high-severity
 * advisories (prototype pollution, ReDoS) with no fix available, so XLSX
 * goes through `exceljs` instead; CSV is simple enough not to need a
 * second parsing library at all.
 */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.length === 0) return [];
  const header = rows[0]!.map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell.trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, (r[idx] ?? "").trim()])));
}

async function parseXlsx(buffer: Buffer): Promise<Record<string, string>[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  let header: string[] = [];
  const rows: Record<string, string>[] = [];

  sheet.eachRow((row, rowNumber) => {
    const values = (row.values as unknown[])
      .slice(1) // ExcelJS row.values is 1-indexed; index 0 is always empty.
      .map((v) => (v === null || v === undefined ? "" : String(v).trim()));

    if (rowNumber === 1) {
      header = values;
      return;
    }
    if (values.every((v) => v === "")) return;
    rows.push(Object.fromEntries(header.map((h, idx) => [h, values[idx] ?? ""])));
  });

  return rows;
}

/** Dispatches on the file's extension — `.xlsx` through ExcelJS, anything else as CSV text. */
export async function parseSpreadsheet(file: { name: string; buffer: Buffer }): Promise<Record<string, string>[]> {
  const isXlsx = file.name.toLowerCase().endsWith(".xlsx");
  return isXlsx ? parseXlsx(file.buffer) : parseCsv(file.buffer.toString("utf-8"));
}
