import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { listTaxonomy } from "@/server/queries/admin-content";
import { QuestionForm } from "../question-form";

export const metadata: Metadata = { title: "New question — CSCA Prep Admin" };

export default async function NewQuestionPage() {
  const user = await requireRole("admin", "content_manager");
  const taxonomy = await listTaxonomy(user.id, user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New question</h1>
        <p className="text-muted-foreground">Questions start as drafts — publish when you&apos;re ready.</p>
      </div>
      <QuestionForm taxonomy={taxonomy} />
    </div>
  );
}
