import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getLeaderboard, getGamificationSummary } from "@/server/queries/gamification";
import { WEEKLY_STREAK_MILESTONE_DAYS } from "@/lib/gamification/streaks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leaderboard — CSCA Prep" };

export default async function LeaderboardPage() {
  const user = await requireUser();
  const [summary, leaderboard] = await Promise.all([getGamificationSummary(user.id, user.role), getLeaderboard(user.id, user.role)]);

  const streakPct = Math.min(100, Math.round((summary.currentStreakDays / WEEKLY_STREAK_MILESTONE_DAYS) * 100));
  const levelPct =
    summary.level.pointsToNextLevel === null
      ? 100
      : Math.round((summary.level.pointsIntoLevel / (summary.level.pointsIntoLevel + summary.level.pointsToNextLevel)) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leaderboard &amp; badges</h1>
        <p className="text-muted-foreground">Points, streaks, and achievements from your practice.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Level {summary.level.level}</CardDescription>
            <CardTitle className="text-2xl">{summary.level.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Progress value={levelPct} />
            <p className="text-xs text-muted-foreground">
              {summary.totalPoints.toLocaleString()} pts
              {summary.level.pointsToNextLevel !== null && ` — ${summary.level.pointsToNextLevel} to next level`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Your rank</CardDescription>
            <CardTitle className="text-2xl">{summary.rank ? `#${summary.rank}` : "Unranked"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {summary.rank ? "Among all students" : "Complete an exam to appear on the leaderboard."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weekly challenge — streak</CardDescription>
            <CardTitle className="text-2xl">{summary.currentStreakDays} days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <Progress value={streakPct} />
            <p className="text-xs text-muted-foreground">
              {summary.currentStreakDays >= WEEKLY_STREAK_MILESTONE_DAYS
                ? "Streak bonus earned this week!"
                : `${WEEKLY_STREAK_MILESTONE_DAYS - summary.currentStreakDays} more day(s) for a streak bonus`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Badges</CardTitle>
          <CardDescription>
            {summary.earned.length} of {summary.earned.length + summary.locked.length} earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...summary.earned, ...summary.locked].map((a) => {
              const isEarned = !!a.earnedAt;
              return (
                <div key={a.code} className={cn("rounded-lg border p-3", !isEarned && "opacity-50")}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    <Badge variant={isEarned ? "default" : "secondary"}>{isEarned ? `+${a.points}` : "Locked"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Rank</th>
                  <th className="p-3 font-medium">Student</th>
                  <th className="p-3 font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.top.map((row) => (
                  <tr key={row.userId} className={cn("border-b last:border-0", row.userId === user.id && "bg-muted/50")}>
                    <td className="p-3 tabular-nums">#{row.rank}</td>
                    <td className="p-3 font-medium">{row.fullName ?? "Anonymous"}{row.userId === user.id && " (you)"}</td>
                    <td className="p-3 tabular-nums">{row.totalPoints.toLocaleString()}</td>
                  </tr>
                ))}
                {leaderboard.own && (
                  <tr className="border-t-2 bg-muted/50">
                    <td className="p-3 tabular-nums">#{leaderboard.own.rank}</td>
                    <td className="p-3 font-medium">{leaderboard.own.fullName ?? "Anonymous"} (you)</td>
                    <td className="p-3 tabular-nums">{leaderboard.own.totalPoints.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
