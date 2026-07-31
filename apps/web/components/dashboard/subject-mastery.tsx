import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubjectMastery } from "@/server/queries/dashboard";

function MasteryRow({ subject }: { subject: SubjectMastery }) {
  const pct = Math.round(subject.masteryScore * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{subject.categoryName}</span>
        <span className="tabular-nums text-muted-foreground">
          {subject.subjectName} · {pct}%
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

function EmptyMasteryState() {
  return <p className="text-sm text-muted-foreground">Practice questions in a few topics to build your subject profile.</p>;
}

export function SubjectMasteryPanel({ weak, strong }: { weak: SubjectMastery[]; strong: SubjectMastery[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Needs work</CardTitle>
          <CardDescription>Your lowest-mastery topics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weak.length > 0 ? weak.map((s) => <MasteryRow key={s.categoryId} subject={s} />) : <EmptyMasteryState />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Strong topics</CardTitle>
          <CardDescription>Where you&apos;re performing best</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {strong.length > 0 ? strong.map((s) => <MasteryRow key={s.categoryId} subject={s} />) : <EmptyMasteryState />}
        </CardContent>
      </Card>
    </div>
  );
}
