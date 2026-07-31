import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getExamResult } from "@/server/queries/exam-results";
import { getPreviousAttemptComparison } from "@/server/queries/exam-history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompositionChart } from "@/components/exam/composition-chart";
import { SubjectBarChart } from "@/components/exam/subject-bar-chart";
import { ComparisonCallout } from "@/components/exam/comparison-callout";

export const metadata: Metadata = { title: "Results — CSCA Prep" };

const MODE_LABEL: Record<string, string> = {
  full_mock: "Full simulation",
  subject_practice: "Subject practice",
  difficulty_practice: "Difficulty practice",
  daily_challenge: "Daily challenge",
};

export default async function ExamResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const user = await requireRole("student", "admin");

  const [result, previous] = await Promise.all([
    getExamResult(user.id, user.role, sessionId),
    getPreviousAttemptComparison(user.id, user.role, sessionId),
  ]);

  // No exam_results row yet usually means the session is still in
  // progress — the exam-taking page itself will redirect back here once
  // it's actually finalized, or 404 if this session isn't real/isn't ours.
  if (!result) {
    redirect(`/exam/${sessionId}`);
  }

  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{result.examTitle ?? "Practice session"} — results</h1>
        <p className="text-muted-foreground">
          {MODE_LABEL[result.mode] ?? result.mode}
          {result.status === "expired" && " · time expired before you finished"}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-3xl font-semibold tabular-nums">{Math.round(result.percentage)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correct</p>
              <p className="text-3xl font-semibold tabular-nums">{result.correctCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wrong</p>
              <p className="text-3xl font-semibold tabular-nums">{result.wrongCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Skipped</p>
              <p className="text-3xl font-semibold tabular-nums">{result.skippedCount}</p>
            </div>
          </div>
          <CompositionChart correct={result.correctCount} wrong={result.wrongCount} skipped={result.skippedCount} />
          <ComparisonCallout currentPercentage={result.percentage} previous={previous} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Time spent</CardTitle>
          <CardDescription>
            {minutes}m {seconds}s across {result.totalQuestions} questions
          </CardDescription>
        </CardHeader>
      </Card>

      {result.subjectBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By subject</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectBarChart data={result.subjectBreakdown} />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button nativeButton={false} render={<Link href="/exam">Take another exam</Link>} />
        <Button nativeButton={false} variant="outline" render={<Link href={`/exam/${sessionId}/review`}>Review answers</Link>} />
        <Button nativeButton={false} variant="outline" render={<Link href="/results">View all results</Link>} />
        <Button nativeButton={false} variant="outline" render={<Link href="/student">Back to dashboard</Link>} />
      </div>
    </div>
  );
}
