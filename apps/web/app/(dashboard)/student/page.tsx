import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { withRlsContext } from "@/lib/db";
import { getStudentDashboardData } from "@/server/queries/dashboard";
import { getCurrentPlanTier, planTierAtLeast } from "@/lib/billing/plan";
import { getGamificationSummary } from "@/server/queries/gamification";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { PointsCard } from "@/components/dashboard/points-card";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { SubjectMasteryPanel } from "@/components/dashboard/subject-mastery";
import { LatestResults } from "@/components/dashboard/latest-results";
import { RecommendedActions } from "@/components/dashboard/recommended-actions";
import { PremiumUpsell } from "@/components/dashboard/premium-upsell";

export const metadata: Metadata = { title: "Dashboard — CSCA Prep" };

export default async function StudentDashboardPage() {
  const user = await requireRole("student", "admin");
  const [data, planTier, gamification] = await Promise.all([
    withRlsContext(user.id, user.role, (tx) => getStudentDashboardData(tx, user.id)),
    getCurrentPlanTier(user.id, user.role),
    getGamificationSummary(user.id, user.role),
  ]);
  const hasAdvancedStats = planTierAtLeast(planTier, "premium");

  return (
    <div className="space-y-6">
      <WelcomeHeader fullName={data.profile.fullName} />
      <ProfileCard fullName={data.profile.fullName} avatarUrl={data.profile.avatarUrl} email={user.email} role={user.role} />
      <StatCards completedTests={data.stats.completedTests} averageScore={data.stats.averageScore} />
      <PointsCard totalPoints={gamification.totalPoints} rank={gamification.rank} level={gamification.level} />
      {hasAdvancedStats ? (
        <ProgressChart data={data.progressSeries} />
      ) : (
        <PremiumUpsell title="Progress over time" description="Track your score trend across every mock exam with Premium." />
      )}
      {hasAdvancedStats ? (
        <SubjectMasteryPanel weak={data.weakSubjects} strong={data.strongSubjects} />
      ) : (
        <PremiumUpsell title="Advanced statistics" description="See your weak and strong subjects, broken down by topic, with Premium." />
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <LatestResults results={data.latestResults} />
        <RecommendedActions actions={data.recommendations} />
      </div>
    </div>
  );
}
