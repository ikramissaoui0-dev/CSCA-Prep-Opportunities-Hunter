import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { listTaxonomy, getQuestionForEdit } from "@/server/queries/admin-content";
import { QuestionForm } from "../../question-form";

export const metadata: Metadata = { title: "Edit question — CSCA Prep Admin" };

export default async function EditQuestionPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params;
  const user = await requireRole("admin", "content_manager");

  const [taxonomy, question] = await Promise.all([
    listTaxonomy(user.id, user.role),
    getQuestionForEdit(user.id, user.role, questionId),
  ]);

  if (!question) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit question</h1>
        <p className="text-muted-foreground">{question.title}</p>
      </div>
      <QuestionForm taxonomy={taxonomy} initialData={question} />
    </div>
  );
}
