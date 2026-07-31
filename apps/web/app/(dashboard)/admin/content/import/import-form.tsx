"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { previewBulkImport, commitBulkImport } from "../actions";
import type { ImportRowResult } from "@/lib/question-import";
import type { ImportRow } from "@/lib/validation/question";

export function ImportForm() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<ImportRowResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [committed, setCommitted] = useState<number | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResults(null);
    setCommitted(null);

    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const result = await previewBulkImport(formData);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setResults(result.data);
    });
  }

  function handleCommit() {
    if (!results) return;
    const validRows: ImportRow[] = results.filter((r) => r.status === "valid").map((r) => r.data);
    startTransition(async () => {
      const result = await commitBulkImport(validRows);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setCommitted(result.data.created);
      setResults(null);
    });
  }

  const validCount = results?.filter((r) => r.status === "valid").length ?? 0;
  const errorCount = results?.filter((r) => r.status === "error").length ?? 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload file</CardTitle>
          <CardDescription>
            Columns: title, body, subject, topic, difficulty (0–1), option1, option2, option3, option4, correctOption
            (1–4), explanation, imageUrl. Imported questions start as drafts for review.
          </CardDescription>
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

      {committed !== null && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Imported {committed} question{committed === 1 ? "" : "s"} as drafts. Review and publish them from the question
          bank.
        </p>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>
              {validCount} valid, {errorCount} with errors. Only valid rows will be imported.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-y-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                    <th className="p-2">Row</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.row} className="border-b last:border-0">
                      <td className="p-2 tabular-nums">{r.row}</td>
                      <td className="max-w-64 truncate p-2">{r.status === "valid" ? r.data.title : (r.raw.title ?? "—")}</td>
                      <td className="p-2">
                        {r.status === "valid" ? (
                          <span className="text-emerald-700">Valid</span>
                        ) : (
                          <span className="text-destructive">{r.message}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={handleCommit} disabled={isPending || validCount === 0}>
              {isPending ? "Importing…" : `Import ${validCount} question${validCount === 1 ? "" : "s"}`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
