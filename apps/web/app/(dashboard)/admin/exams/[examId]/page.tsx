import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getExamForEdit } from "@/server/queries/admin-exams";
import { listTaxonomy } from "@/server/queries/admin-content";
import { ExamForm } from "../exam-form";

export const metadata: Metadata = { title: "Edit exam — CSCA Prep Admin" };

export default async function EditExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const user = await requireRole("admin", "content_manager");

  const [exam, taxonomy] = await Promise.all([getExamForEdit(user.id, user.role, examId), listTaxonomy(user.id, user.role)]);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit exam</h1>
        <p className="text-muted-foreground">{exam.title}</p>
      </div>
      <ExamForm taxonomy={taxonomy} initialData={exam} />
    </div>
  );
}
