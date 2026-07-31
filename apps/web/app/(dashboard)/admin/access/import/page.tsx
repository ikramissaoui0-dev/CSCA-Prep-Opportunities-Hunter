import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { AccessGrantImportForm } from "./import-form";

export const metadata: Metadata = { title: "Import Students — CSCA Prep Admin" };

export default async function ImportAccessGrantsPage() {
  await requireRole("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import students</h1>
        <p className="text-muted-foreground">Grant free access to a batch of students at once from a CSV or Excel file.</p>
      </div>
      <AccessGrantImportForm />
    </div>
  );
}
