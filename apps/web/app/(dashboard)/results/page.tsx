import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listExamHistory, getProgressEvolution, type ExamMode } from "@/server/queries/exam-history";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Results history — CSCA Prep" };

const PAGE_SIZE = 20;
const MODES: ExamMode[] = ["full_mock", "subject_practice", "difficulty_practice", "daily_challenge"];
const MODE_LABEL: Record<string, string> = {
  full_mock: "Full simulation",
  subject_practice: "Subject practice",
  difficulty_practice: "Difficulty practice",
  daily_challenge: "Daily challenge",
};

export default async function ResultsHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireRole("student", "admin");
  const mode = MODES.includes(sp.mode as ExamMode) ? (sp.mode as ExamMode) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ rows, total }, evolution] = await Promise.all([
    listExamHistory(user.id, user.role, { mode, page, pageSize: PAGE_SIZE }),
    getProgressEvolution(user.id, user.role, mode),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (mode) params.set("mode", mode);
    params.set("page", String(target));
    return `/results?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Results history</h1>
        <p className="text-muted-foreground">
          {total} completed exam{total === 1 ? "" : "s"}
        </p>
      </div>

      <Card>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <label htmlFor="mode" className="text-xs font-medium text-muted-foreground">
                Mode
              </label>
              <select
                id="mode"
                name="mode"
                defaultValue={mode ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All modes</option>
                {MODES.map((m) => (
                  <option key={m} value={m}>
                    {MODE_LABEL[m]}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <ProgressChart data={evolution} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All attempts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No completed exams yet for this filter.</p>
          ) : (
            <ul className="divide-y">
              {rows.map((r) => (
                <li key={r.sessionId}>
                  <Link
                    href={`/exam/${r.sessionId}/results`}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{r.examTitle ?? "Practice session"}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="font-normal">
                          {MODE_LABEL[r.mode] ?? r.mode}
                        </Badge>
                        <span>
                          {r.submittedAt ? r.submittedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                        </span>
                        {r.status === "expired" && <span className="text-destructive">expired</span>}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums">{Math.round(r.percentage)}%</p>
                      <p className="text-xs tabular-nums text-muted-foreground">
                        {r.correctCount}/{r.totalQuestions} correct
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} nativeButton={false} render={<Link href={pageHref(page - 1)}>Previous</Link>} />
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            nativeButton={false}
            render={<Link href={pageHref(page + 1)}>Next</Link>}
          />
        </div>
      )}
    </div>
  );
}
