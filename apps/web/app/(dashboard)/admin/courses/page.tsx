import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listCourses } from "@/server/queries/admin-courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./row-actions";

export const metadata: Metadata = { title: "Courses — CSCA Prep Admin" };

const PAGE_SIZE = 20;
const PLAN_LABEL: Record<string, string> = { free: "Free", premium: "Premium", premium_plus: "Premium+" };

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireRole("admin", "content_manager");

  const status = sp.status === "published" || sp.status === "draft" ? sp.status : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const { rows, total } = await listCourses(user.id, user.role, {
    search: sp.q?.trim() || undefined,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (status !== "all") params.set("status", status);
    params.set("page", String(targetPage));
    return `/admin/courses?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            {total} course{total === 1 ? "" : "s"}
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/courses/new">New course</Link>} />
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
              <label htmlFor="status" className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select id="status" name="status" defaultValue={status} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
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
            <p className="p-6 text-sm text-muted-foreground">No courses match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Title</th>
                    <th className="p-3 font-medium">Subject</th>
                    <th className="p-3 font-medium">Plan</th>
                    <th className="p-3 font-medium">Lessons</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((course) => (
                    <tr key={course.id} className="border-b last:border-0">
                      <td className="max-w-64 p-3">
                        <Link href={`/admin/courses/${course.id}`} className="font-medium hover:underline">
                          {course.title}
                        </Link>
                      </td>
                      <td className="p-3 text-muted-foreground">{course.subjectName ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{PLAN_LABEL[course.requiredPlanTier]}</td>
                      <td className="p-3 tabular-nums text-muted-foreground">{course.lessonCount}</td>
                      <td className="p-3">
                        <Badge variant={course.isPublished ? "default" : "secondary"}>{course.isPublished ? "Published" : "Draft"}</Badge>
                      </td>
                      <td className="p-3">
                        <RowActions courseId={course.id} isPublished={course.isPublished} />
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
