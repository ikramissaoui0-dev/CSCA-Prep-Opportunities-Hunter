import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCards({ completedTests, averageScore }: { completedTests: number; averageScore: number | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Completed mock exams</CardDescription>
          <CardTitle className="text-3xl tabular-nums">{completedTests}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Average score</CardDescription>
          <CardTitle className="text-3xl tabular-nums">{averageScore === null ? "—" : `${Math.round(averageScore)}%`}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
