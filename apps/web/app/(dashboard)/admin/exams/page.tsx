import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listExams } from "@/server/queries/admin-exams";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./row-actions";

export const metadata: Metadata = { title: "Exams — CSCA Prep Admin" };

const PAGE_SIZE = 20;
const MODE_LABEL: Record<string, string> = { full_mock: "Full simulation", daily_challenge: "Daily challenge" };

export default async function AdminExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mode?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireRole("admin", "content_manager");

  const mode = sp.mode === "full_mock" || sp.mode === "daily_challenge" ? sp.mode : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const { rows, total } = await listExams(user.id, user.role, {
    search: sp.q?.trim() || undefined,
    mode,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (mode !== "all") params.set("mode", mode);
    params.set("page", String(targetPage));
    return `/admin/exams?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Exams</h1>
          <p className="text-muted-foreground">
            {total} exam{total === 1 ? "" : "s"}
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/exams/new">New exam</Link>} />
      </div>

      <Card>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1 space-y-1.5">
              <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
                Search
              </label>
              <Input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search title…" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="mode" className="text-xs font-medium text-muted-foreground">
                Mode
              </label>
              <select id="mode" name="mode" defaultValue={mode} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="all">All modes</option>
                <option value="full_mock">Full simulation</option>
                <option value="daily_challenge">Daily challenge</option>
              </select>
            </div>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No exams match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Title</th>
                    <th className="p-3 font-medium">Mode</th>
                    <th className="p-3 font-medium">Time limit</th>
                    <th className="p-3 font-medium">Questions</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((exam) => (
                    <tr key={exam.id} className="border-b last:border-0">
                      <td className="max-w-64 p-3">
                        <Link href={`/admin/exams/${exam.id}`} className="font-medium hover:underline">
                          {exam.title}
                        </Link>
                        {exam.challengeDate && <p className="text-xs text-muted-foreground">{exam.challengeDate}</p>}
                      </td>
                      <td className="p-3 text-muted-foreground">{MODE_LABEL[exam.mode] ?? exam.mode}</td>
                      <td className="p-3 tabular-nums text-muted-foreground">{Math.round(exam.timeLimitSeconds / 60)} min</td>
                      <td className="p-3 tabular-nums text-muted-foreground">{exam.questionCount}</td>
                      <td className="p-3">
                        <Badge variant={exam.isPublished ? "default" : "secondary"}>{exam.isPublished ? "Published" : "Draft"}</Badge>
                      </td>
                      <td className="p-3">
                        <RowActions examId={exam.id} isPublished={exam.isPublished} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
