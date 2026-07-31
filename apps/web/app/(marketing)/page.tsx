import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, Sparkles, BarChart3, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "CSCA Exam Prep — Mock Exams, AI Explanations & Progress Tracking",
  description:
    "Prepare for the CSCA with realistic mock exams, adaptive practice by subject and difficulty, AI-powered explanations, and progress tracking built for international students applying to study in China.",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Realistic mock exams",
    description: "Full CSCA simulations, subject practice, difficulty-targeted drills, and a daily challenge — all timed like the real thing.",
  },
  {
    icon: Sparkles,
    title: "AI-powered explanations",
    description: "Get a clear, specific explanation the moment you miss a question — not just an answer key.",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description: "Track your score trend and your weakest subjects, so every study session targets what actually needs work.",
  },
  {
    icon: Trophy,
    title: "Built to keep you motivated",
    description: "Points, streaks, and badges turn consistent practice into visible progress.",
  },
];

const STEPS = [
  { title: "Create your free account", description: "Sign up in under a minute — no credit card required to start practicing." },
  { title: "Take a mock exam or practice by subject", description: "Choose a full simulation, target a weak subject, or try the daily challenge." },
  { title: "Review, learn, and track your progress", description: "Get instant results, AI explanations for what you missed, and a dashboard that shows how you're improving." },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Opportunities Hunter</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Prepare for the CSCA with confidence
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Realistic mock exams, adaptive practice, and AI-powered explanations built specifically for international
          students preparing for the CSCA and admission to Chinese universities.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/register">Start practicing free</Link>} />
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/pricing">See pricing</Link>} />
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="size-6 text-primary" aria-hidden="true" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="space-y-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" nativeButton={false} render={<Link href="/how-it-works">Learn more about how it works</Link>} />
        </div>
      </section>

      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to start preparing?</h2>
          <p className="mt-2 text-primary-foreground/80">Create your free account and take your first mock exam today.</p>
          <div className="mt-6">
            <Button size="lg" variant="secondary" nativeButton={false} render={<Link href="/register">Get started free</Link>} />
          </div>
        </div>
      </section>
    </div>
  );
}
