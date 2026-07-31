import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { ImportForm } from "./import-form";

export const metadata: Metadata = { title: "Import questions — CSCA Prep Admin" };

export default async function ImportQuestionsPage() {
  await requireRole("admin", "content_manager");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import questions</h1>
        <p className="text-muted-foreground">Bulk-create questions from a CSV or Excel file.</p>
      </div>
      <ImportForm />
    </div>
  );
}
