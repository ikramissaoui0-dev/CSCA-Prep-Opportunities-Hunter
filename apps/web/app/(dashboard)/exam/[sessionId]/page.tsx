import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getExamSessionForTaking } from "@/server/queries/exam-session";
import { ExamRunner } from "./exam-runner";

export const metadata: Metadata = { title: "Exam in progress — CSCA Prep" };

export default async function ExamTakingPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const user = await requireRole("student", "admin");
  const session = await getExamSessionForTaking(user.id, user.role, sessionId);

  if (!session) {
    notFound();
  }

  // Already finalized (submitted, or just discovered expired by the
  // query above) — nothing left to take, go straight to results.
  if (session.status !== "in_progress") {
    redirect(`/exam/${sessionId}/results`);
  }

  return (
    <ExamRunner
      sessionId={session.id}
      startedAtMs={session.startedAt.getTime()}
      timeLimitSeconds={session.timeLimitSeconds}
      questions={session.questions}
      initialAnswers={session.answers}
    />
  );
}
