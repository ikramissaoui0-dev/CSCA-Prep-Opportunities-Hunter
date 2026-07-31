import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendedAction } from "@/server/queries/dashboard";

export function RecommendedActions({ actions }: { actions: RecommendedAction[] }) {
  const hasAiGenerated = actions.some((a) => !a.isFallback);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for you</CardTitle>
        <CardDescription>
          {hasAiGenerated
            ? "AI-generated suggestions based on your recent performance."
            : "Suggestions based on your recent performance."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="rounded-lg border p-3">
            <p className="text-sm font-medium">{action.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{action.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
