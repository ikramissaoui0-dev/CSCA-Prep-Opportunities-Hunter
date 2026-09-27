import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { listUsers } from "@/server/queries/admin-users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { USER_ROLES, type UserRole } from "@csca/types";
import { RoleSelect } from "./role-select";

export const metadata: Metadata = { title: "Users — CSCA Prep Admin" };

const PAGE_SIZE = 20;
const ROLE_LABEL: Record<UserRole, string> = {
  student: "Student",
  admin: "Admin",
  content_manager: "Content Manager",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireRole("admin");

  const roleFilter = (USER_ROLES as readonly string[]).includes(sp.role ?? "") ? (sp.role as UserRole) : "all";
  const page = Math.max(1, Number(sp.page) || 1);

  const { rows, total } = await listUsers(user.id, user.role, {
    search: sp.q?.trim() || undefined,
    role: roleFilter,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (roleFilter !== "all") params.set("role", roleFilter);
    params.set("page", String(targetPage));
    return `/admin/users?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          {total} user{total === 1 ? "" : "s"}
        </p>
      </div>

      <Card>
        <CardContent>
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1 space-y-1.5">
              <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
                Search
              </label>
              <Input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search name or email…" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-xs font-medium text-muted-foreground">
                Role
              </label>
              <select
                id="role"
                name="role"
                defaultValue={roleFilter}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All roles</option>
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No users match these filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="p-3 font-medium">Phone</th>
                    <th className="p-3 font-medium">Joined</th>
                    <th className="p-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="p-3 font-medium">{row.fullName ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{row.email ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{row.phone ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{row.createdAt.toLocaleDateString()}</td>
                      <td className="p-3">
                        <RoleSelect userId={row.id} role={row.role} isSelf={row.id === user.id} />
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
