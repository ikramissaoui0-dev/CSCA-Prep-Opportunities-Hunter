"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ProgressPoint } from "@/server/queries/dashboard";

const chartConfig = {
  percentage: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ProgressChart({ data }: { data: ProgressPoint[] }) {
  if (data.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress over time</CardTitle>
          <CardDescription>Complete a few more mock exams to see your trend here.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartData = data.map((point, index) => ({
    // Fixed locale, not the runtime default: this renders once on the
    // server and once on the client during hydration, and those two
    // environments can disagree on the default locale (exactly the class
    // of bug fixed in components/ui/progress.tsx) — pinning it keeps
    // both renders identical regardless of server region or a visitor's
    // browser language.
    label: point.date ? point.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `#${index + 1}`,
    percentage: point.percentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress over time</CardTitle>
        <CardDescription>Your mock exam score across your last {data.length} attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 12, top: 12 }}>
            <defs>
              <linearGradient id="fillPercentage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-percentage)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-percentage)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} width={32} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="percentage"
              type="monotone"
              fill="url(#fillPercentage)"
              stroke="var(--color-percentage)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
