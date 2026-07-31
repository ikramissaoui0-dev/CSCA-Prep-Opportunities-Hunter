import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getAdminDashboardMetrics } from "@/server/queries/admin-metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin — CSCA Prep" };

function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");
  const metrics = await getAdminDashboardMetrics(user.id, user.role);

  const statCards = [
    { label: "Total students", value: metrics.totalStudents.toLocaleString() },
    { label: "Active users (30d)", value: metrics.activeUsers.toLocaleString() },
    { label: "Exams completed", value: metrics.examsCompleted.toLocaleString() },
    { label: "Average score", value: metrics.averageScore === null ? "—" : `${metrics.averageScore.toFixed(1)}%` },
    { label: "Revenue", value: formatUsd(metrics.revenueCents) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="text-muted-foreground">Platform-wide metrics across every student.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl">{card.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Most-practiced subjects</CardTitle>
          <CardDescription>By total questions attempted, all time.</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.popularSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exam activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {metrics.popularSubjects.map((s, i) => (
                <li key={s.subjectId} className="flex items-center justify-between gap-4 rounded-lg border p-3 text-sm">
                  <span className="font-medium">
                    {i + 1}. {s.subjectName}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{s.attemptCount.toLocaleString()} attempts</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {metrics.revenueCents === 0 && (
        <p className="text-xs text-muted-foreground">
          Revenue and payment data will populate once Stripe billing (Phase 9) is wired up.
        </p>
      )}
    </div>
  );
}
