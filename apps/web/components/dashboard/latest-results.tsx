import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LatestResult } from "@/server/queries/dashboard";

const MODE_LABEL: Record<string, string> = {
  full_mock: "Full simulation",
  subject_practice: "Subject practice",
  difficulty_practice: "Difficulty practice",
  daily_challenge: "Daily challenge",
};

export function LatestResults({ results }: { results: LatestResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest results</CardTitle>
        <CardDescription>Your most recent mock exam attempts</CardDescription>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground">No mock exams completed yet — your results will show up here.</p>
        ) : (
          <ul className="divide-y">
            {results.map((r) => (
              <li key={r.sessionId} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{r.examTitle ?? "Practice session"}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-normal">
                      {MODE_LABEL[r.mode] ?? r.mode}
                    </Badge>
                    <span>
                      {/* Fixed locale: this is a Server Component (no client hydration to mismatch), but the
                          date format should still be consistent regardless of the server host's own locale. */}
                      {r.submittedAt
                        ? r.submittedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums">{Math.round(r.percentage)}%</p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {r.correctCount}/{r.totalQuestions} correct
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
