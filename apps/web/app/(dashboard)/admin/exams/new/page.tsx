import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { listTaxonomy } from "@/server/queries/admin-content";
import { ExamForm } from "../exam-form";

export const metadata: Metadata = { title: "New exam — CSCA Prep Admin" };

export default async function NewExamPage() {
  const user = await requireRole("admin", "content_manager");
  const taxonomy = await listTaxonomy(user.id, user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New exam</h1>
        <p className="text-muted-foreground">Create a full simulation or a daily challenge.</p>
      </div>
      <ExamForm taxonomy={taxonomy} />
    </div>
  );
}
