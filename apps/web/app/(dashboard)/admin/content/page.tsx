import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listQuestions, listTaxonomy } from "@/server/queries/admin-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./row-actions";

export const metadata: Metadata = { title: "Question bank — CSCA Prep Admin" };

const PAGE_SIZE = 20;

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string; category?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireRole("admin", "content_manager");

  const status = sp.status === "published" || sp.status === "draft" ? sp.status : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ rows, total }, taxonomy] = await Promise.all([
    listQuestions(user.id, user.role, {
      search: sp.q?.trim() || undefined,
      subjectId: sp.subject || undefined,
      categoryId: sp.category || undefined,
      isPublished: status,
      page,
      pageSize: PAGE_SIZE,
    }),
    listTaxonomy(user.id, user.role),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const categories = sp.subject ? (taxonomy.find((s) => s.id === sp.subject)?.categories ?? []) : [];

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.subject) params.set("subject", sp.subject);
    if (sp.category) params.set("category", sp.category);
    if (status !== "all") params.set("status", status);
    params.set("page", String(targetPage));
    return `/admin/content?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Question bank</h1>
          <p className="text-muted-foreground">
            {total} question{total === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/content/import">Import</Link>} />
          <Button nativeButton={false} render={<Link href="/admin/content/new">New question</Link>} />
        </div>
      </div>

      <Card>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1 space-y-1.5">
              <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
                Search
              </label>
              <Input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search title or body…" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-medium text-muted-foreground">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                defaultValue={sp.subject ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All subjects</option>
                {taxonomy.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-medium text-muted-foreground">
                Topic
              </label>
              <select
                id="category"
                name="category"
                defaultValue={sp.category ?? ""}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All topics</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No questions match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Title</th>
                    <th className="p-3 font-medium">Subject / Topic</th>
                    <th className="p-3 font-medium">Difficulty</th>
                    <th className="p-3 font-medium">Options</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((q) => (
                    <tr key={q.id} className="border-b last:border-0">
                      <td className="max-w-64 p-3">
                        <Link href={`/admin/content/${q.id}/edit`} className="font-medium hover:underline">
                          {q.title}
                        </Link>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {q.subjectName} / {q.categoryName}
                      </td>
                      <td className="p-3 tabular-nums text-muted-foreground">{Math.round(q.difficulty * 100)}%</td>
                      <td className="p-3 tabular-nums text-muted-foreground">{q.optionCount}</td>
                      <td className="p-3">
                        <Badge variant={q.isPublished ? "default" : "secondary"}>{q.isPublished ? "Published" : "Draft"}</Badge>
                      </td>
                      <td className="p-3">
                        <RowActions questionId={q.id} isPublished={q.isPublished} />
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
