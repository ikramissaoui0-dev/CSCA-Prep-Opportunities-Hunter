"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

// Status colors, not arbitrary categorical hues — correct/wrong/skipped
// carry an inherent good/bad/neutral meaning, the same semantic the app
// already uses for --destructive elsewhere (e.g. form errors).
const chartConfig = {
  correct: { label: "Correct", color: "var(--success)" },
  wrong: { label: "Wrong", color: "var(--destructive)" },
  skipped: { label: "Skipped", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

export function CompositionChart({ correct, wrong, skipped }: { correct: number; wrong: number; skipped: number }) {
  const data = [{ name: "Questions", correct, wrong, skipped }];

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-16 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" hide />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="correct" stackId="a" fill="var(--color-correct)" radius={[4, 0, 0, 4]} isAnimationActive={false} />
        <Bar dataKey="wrong" stackId="a" fill="var(--color-wrong)" isAnimationActive={false} />
        <Bar dataKey="skipped" stackId="a" fill="var(--color-skipped)" radius={[0, 4, 4, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
