"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { previewAccessGrantImport, commitAccessGrantImport } from "../actions";
import type { AccessGrantImportPreviewRow } from "@/lib/admin/access-grant-import";
import type { AccessGrantImportRow, GrantedTierInput, ExpirationOptionInput } from "@/lib/validation/access-grants";

// Array.prototype.filter doesn't narrow the element type from a plain
// boolean predicate — this type guard is what lets .map() below see
// `.data` without a cast.
function isImportableRow(
  r: AccessGrantImportPreviewRow,
): r is Extract<AccessGrantImportPreviewRow, { status: "valid" }> {
  return r.status === "valid" && !r.isDuplicateInFile;
}

const EXPIRATION_LABEL: Record<ExpirationOptionInput, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "3m": "3 months",
  "6m": "6 months",
  "12m": "12 months",
  permanent: "Permanent",
  custom: "Custom date",
};

type CommitSummary = { created: number; updated: number; duplicatesSkipped: number; errors: number };

export function AccessGrantImportForm() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<AccessGrantImportPreviewRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CommitSummary | null>(null);
  const [defaultGrantedTier, setDefaultGrantedTier] = useState<GrantedTierInput>("premium_plus");
  const [defaultExpirationOption, setDefaultExpirationOption] = useState<ExpirationOptionInput>("12m");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResults(null);
    setSummary(null);

    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await previewAccessGrantImport(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setResults(result.data);
    });
  }

  function handleCommit() {
    if (!results) return;
    const validRows: AccessGrantImportRow[] = results.filter(isImportableRow).map((r) => r.data);
    startTransition(async () => {
      const result = await commitAccessGrantImport({ rows: validRows, defaultGrantedTier, defaultExpirationOption });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSummary(result.data);
      setResults(null);
    });
  }

  const validRows = results?.filter((r) => r.status === "valid" && !r.isDuplicateInFile) ?? [];
  const duplicateCount = results?.filter((r) => r.status === "valid" && r.isDuplicateInFile).length ?? 0;
  const errorCount = results?.filter((r) => r.status === "error").length ?? 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default access for this batch</CardTitle>
          <CardDescription>
            Applies to every row, unless a row&apos;s own expiration_date column overrides the duration.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="defaultGrantedTier">Access level</Label>
            <select
              id="defaultGrantedTier"
              value={defaultGrantedTier}
              onChange={(e) => setDefaultGrantedTier(e.target.value as GrantedTierInput)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="premium">Premium</option>
              <option value="premium_plus">Premium+</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="defaultExpirationOption">Default duration</Label>
            <select
              id="defaultExpirationOption"
              value={defaultExpirationOption}
              onChange={(e) => setDefaultExpirationOption(e.target.value as ExpirationOptionInput)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {(Object.keys(EXPIRATION_LABEL) as ExpirationOptionInput[])
                .filter((opt) => opt !== "custom")
                .map((opt) => (
                  <option key={opt} value={opt}>
                    {EXPIRATION_LABEL[opt]}
                  </option>
                ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload file</CardTitle>
          <CardDescription>Columns: first_name, last_name, email, expiration_date (optional, e.g. 2027-01-31).</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            disabled={isPending}
            className="text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm"
          />
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Successfully imported: {summary.created}</p>
            <p>Existing students updated: {summary.updated}</p>
            <p>Duplicates skipped: {summary.duplicatesSkipped}</p>
            <p>Errors: {summary.errors}</p>
          </CardContent>
        </Card>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>
              {validRows.length} ready to import, {duplicateCount} duplicate email(s) in the file, {errorCount} with
              errors. Only the {validRows.length} valid, non-duplicate row(s) will be imported — nothing here is
              discarded silently, review every row below first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-y-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                    <th className="p-2">Row</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Account</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.row} className="border-b last:border-0">
                      <td className="p-2 tabular-nums">{r.row}</td>
                      <td className="p-2">
                        {r.status === "valid" ? `${r.data.first_name} ${r.data.last_name}`.trim() || "—" : (r.raw.first_name ?? "—")}
                      </td>
                      <td className="p-2">{r.status === "valid" ? r.data.email : (r.raw.email ?? "—")}</td>
                      <td className="p-2 text-muted-foreground">
                        {r.status === "valid" ? (r.accountStatus === "existing" ? "Existing account" : "No account yet") : "—"}
                      </td>
                      <td className="p-2">
                        {r.status === "error" ? (
                          <span className="text-destructive">{r.message}</span>
                        ) : r.isDuplicateInFile ? (
                          <span className="text-amber-700">Duplicate in file — skipped</span>
                        ) : (
                          <span className="text-emerald-700">Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={handleCommit} disabled={isPending || validRows.length === 0}>
              {isPending ? "Importing…" : `Import ${validRows.length} student${validRows.length === 1 ? "" : "s"}`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
