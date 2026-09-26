import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getSessionReview } from "@/server/queries/exam-review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExplanationPanel } from "./explanation-panel";

export const metadata: Metadata = { title: "Review answers — CSCA Prep" };

const STATUS_LABEL: Record<string, string> = { correct: "Correct", wrong: "Wrong", skipped: "Skipped" };
const STATUS_CLASS: Record<string, string> = {
  correct: "border-success/40 bg-success/10 text-success",
  wrong: "border-destructive/40 bg-destructive/10 text-destructive",
  skipped: "border-border bg-muted text-muted-foreground",
};

export default async function ExamReviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const user = await requireRole("student", "admin");
  const questionsList = await getSessionReview(user.id, user.role, sessionId);

  if (!questionsList) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review answers</h1>
        <p className="text-muted-foreground">Question-by-question breakdown with detailed explanations for anything you missed.</p>
      </div>

      <div className="space-y-4">
        {questionsList.map((q, i) => (
          <Card key={q.questionId}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">
                  {i + 1}. {q.title}
                </CardTitle>
                <Badge variant="outline" className={cn("shrink-0 font-normal", STATUS_CLASS[q.status])}>
                  {STATUS_LABEL[q.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground">{q.body}</p>

              {q.type === "mcq" ? (
                <ul className="space-y-1.5">
                  {q.options.map((option) => (
                    <li
                      key={option.id}
                      className={cn(
                        "rounded-lg border p-2.5 text-sm",
                        option.isCorrect && "border-success/40 bg-success/10",
                        option.id === q.selectedOptionId && !option.isCorrect && "border-destructive/40 bg-destructive/10",
                      )}
                    >
                      {option.content}
                      {option.isCorrect && <span className="ml-2 text-xs text-success">correct answer</span>}
                      {option.id === q.selectedOptionId && !option.isCorrect && <span className="ml-2 text-xs text-destructive">your answer</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Your answer</p>
                    <p className="rounded-lg border p-2.5">{q.freeResponseText ?? "(no answer submitted)"}</p>
                  </div>
                  {q.correctAnswerText && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Model answer</p>
                      <p className="rounded-lg border border-success/40 bg-success/10 p-2.5">{q.correctAnswerText}</p>
                    </div>
                  )}
                </div>
              )}

              {q.status !== "skipped" && (
                <ExplanationPanel sessionId={sessionId} questionId={q.questionId} cachedExplanation={q.cachedExplanation} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button nativeButton={false} variant="outline" render={<Link href={`/exam/${sessionId}/results`}>Back to results</Link>} />
      </div>
    </div>
  );
}
