"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  percentage: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function SubjectBarChart({ data }: { data: { subjectName: string; percentage: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto w-full" style={{ height: Math.max(120, data.length * 44) }}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="subjectName" tickLine={false} axisLine={false} width={110} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="percentage" fill="var(--color-percentage)" radius={4} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
