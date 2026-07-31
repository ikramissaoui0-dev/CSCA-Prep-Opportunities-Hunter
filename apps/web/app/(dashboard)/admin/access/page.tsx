import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listAccessGrants, getAccessGrantStatusCounts, type AccessGrantStatus } from "@/server/queries/admin-access-grants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GrantAccessForm } from "./grant-form";
import { RowActions } from "./row-actions";

export const metadata: Metadata = { title: "Student Free Access — CSCA Prep Admin" };

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<"all" | AccessGrantStatus, string> = {
  all: "All",
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
  pending_registration: "Pending Registration",
  revoked: "Revoked",
};

const STATUS_BADGE_LABEL: Record<AccessGrantStatus, string> = {
  active: "ACTIVE",
  expiring_soon: "EXPIRING SOON",
  expired: "EXPIRED",
  pending_registration: "PENDING REGISTRATION",
  revoked: "REVOKED",
};

const TIER_LABEL: Record<string, string> = { premium: "Premium", premium_plus: "Premium+" };

export default async function AdminAccessGrantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const admin = await requireRole("admin");

  const statusKeys = Object.keys(STATUS_LABEL) as ("all" | AccessGrantStatus)[];
  const status = statusKeys.includes(sp.status as (typeof statusKeys)[number]) ? (sp.status as "all" | AccessGrantStatus) : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ rows, total }, counts] = await Promise.all([
    listAccessGrants(admin.id, admin.role, { search: sp.q?.trim() || undefined, status, page, pageSize: PAGE_SIZE }),
    getAccessGrantStatusCounts(admin.id, admin.role),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (status !== "all") params.set("status", status);
    params.set("page", String(targetPage));
    return `/admin/access?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Student Free Access</h1>
          <p className="text-muted-foreground">Give selected students premium access without a paid subscription.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/access/import">Import Students</Link>} />
          <GrantAccessForm trigger={<Button>Grant Free Access</Button>} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b pb-3">
        {statusKeys.map((key) => (
          <Link
            key={key}
            href={`/admin/access?status=${key}`}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm hover:bg-muted",
              status === key ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {STATUS_LABEL[key]} ({counts[key]})
          </Link>
        ))}
      </div>

      <Card>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-3">
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <div className="min-w-48 flex-1 space-y-1.5">
              <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
                Search
              </label>
              <Input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search by name or email…" />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No students match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Student</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Account Status</th>
                    <th className="p-3 font-medium">Access Status</th>
                    <th className="p-3 font-medium">Granted Date</th>
                    <th className="p-3 font-medium">Expiration Date</th>
                    <th className="p-3 font-medium">Last Login</th>
                    <th className="p-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((grant) => (
                    <tr key={grant.id} className="border-b last:border-0 align-top">
                      <td className="p-3 font-medium">{grant.fullName ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">
                        {grant.email}
                        {grant.adminNote && <p className="mt-0.5 text-xs italic">{grant.adminNote}</p>}
                      </td>
                      <td className="p-3">
                        <Badge variant={grant.userId ? "default" : "secondary"}>{grant.userId ? "Has account" : "No account yet"}</Badge>
                      </td>
                      <td className="p-3 space-y-1">
                        <Badge variant={grant.status === "active" || grant.status === "expiring_soon" ? "default" : "secondary"}>
                          {STATUS_BADGE_LABEL[grant.status]}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{TIER_LABEL[grant.grantedTier]}</p>
                      </td>
                      <td className="p-3 text-muted-foreground">{grant.grantedAt.toLocaleDateString()}</td>
                      <td className="p-3 text-muted-foreground">{grant.expiresAt ? grant.expiresAt.toLocaleDateString() : "Permanent"}</td>
                      <td className="p-3 text-muted-foreground">{grant.lastSignInAt ? grant.lastSignInAt.toLocaleDateString() : "Never"}</td>
                      <td className="p-3">
                        <RowActions grant={grant} />
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
