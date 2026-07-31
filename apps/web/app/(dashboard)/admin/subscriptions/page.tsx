import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listSubscriptions } from "@/server/queries/admin-subscriptions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Subscriptions — CSCA Prep Admin" };

const PAGE_SIZE = 20;
const PLAN_LABEL: Record<string, string> = { free: "Free", premium: "Premium", premium_plus: "Premium+" };
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireRole("admin");

  const page = Math.max(1, Number(sp.page) || 1);
  const status = (sp.status ?? "all") as
    | "all"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "unpaid"
    | "paused";

  const { rows, total } = await listSubscriptions(user.id, user.role, {
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
    return `/admin/subscriptions?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">
          {total} subscription{total === 1 ? "" : "s"} — read-only, mirrored from Stripe (Phase 9).
        </p>
      </div>

      <Card>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1 space-y-1.5">
              <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
                Search
              </label>
              <Input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search by email…" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select id="status" name="status" defaultValue={status} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="past_due">Past due</option>
                <option value="canceled">Canceled</option>
                <option value="unpaid">Unpaid</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No subscriptions yet — this fills in once Stripe billing (Phase 9) is wired up. Every student is on the free
              plan until then.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">User</th>
                    <th className="p-3 font-medium">Plan</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Renews / ends</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="p-3">
                        <p className="font-medium">{row.userFullName ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{row.userEmail}</p>
                      </td>
                      <td className="p-3">{PLAN_LABEL[row.planTier]}</td>
                      <td className="p-3">
                        <Badge variant={ACTIVE_STATUSES.has(row.status) ? "default" : "secondary"}>{row.status}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {row.currentPeriodEnd.toLocaleDateString()}
                        {row.cancelAtPeriodEnd && " (canceling)"}
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
