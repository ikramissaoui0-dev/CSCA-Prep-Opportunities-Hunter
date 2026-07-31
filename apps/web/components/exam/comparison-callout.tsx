import { cn } from "@/lib/utils";
import type { PreviousAttemptComparison } from "@/server/queries/exam-history";

export function ComparisonCallout({ currentPercentage, previous }: { currentPercentage: number; previous: PreviousAttemptComparison | null }) {
  if (!previous) {
    return <p className="text-sm text-muted-foreground">This is your first attempt here — nothing to compare yet.</p>;
  }

  const delta = Math.round(currentPercentage - previous.previousPercentage);
  const previousPct = Math.round(previous.previousPercentage);

  if (delta === 0) {
    return (
      <p className="text-sm font-medium text-muted-foreground">Same as your last attempt ({previousPct}%).</p>
    );
  }

  return (
    <p className={cn("text-sm font-medium", delta > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-destructive")}>
      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}% {delta > 0 ? "better than" : "lower than"} your last attempt ({previousPct}%)
    </p>
  );
}
