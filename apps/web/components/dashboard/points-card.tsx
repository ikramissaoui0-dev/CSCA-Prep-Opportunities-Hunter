import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LevelInfo } from "@/lib/gamification/levels";

export function PointsCard({ totalPoints, rank, level }: { totalPoints: number; rank: number | null; level: LevelInfo }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardDescription>
            Level {level.level} — {level.title}
          </CardDescription>
          <CardTitle className="text-2xl">
            {totalPoints.toLocaleString()} pts{rank ? ` · #${rank}` : ""}
          </CardTitle>
        </div>
        <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/student/leaderboard">View badges</Link>} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {level.pointsToNextLevel === null ? "You've reached the top level." : `${level.pointsToNextLevel} points to level ${level.level + 1}.`}
        </p>
      </CardContent>
    </Card>
  );
}
