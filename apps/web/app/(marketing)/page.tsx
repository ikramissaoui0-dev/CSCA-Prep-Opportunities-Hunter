import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, BookOpenCheck, Sparkles, BarChart3, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { ROLE_HOME_ROUTE } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "CSCA Exam Prep — Mock Exams, Personalized Explanations & Progress Tracking",
  description:
    "Prepare for the CSCA with real past exam papers, everyday practice exercises by subject and difficulty, personalized explanations, and progress tracking built for international students applying to study in China.",
  alternates: { canonical: "/" },
};

// Deliberately two separate cards, not one merged "mock exams" card —
// past exam papers (real questions from an actual sitting) and practice
// exercises (everyday drilling) are a different kind of content and are
// kept visibly separate everywhere in the app (see /exam), so the
// marketing page shouldn't blur them into one either.
const FEATURES = [
  {
    icon: FileCheck2,
    title: "Real past exam papers",
    description: "The exact questions from an actual CSCA sitting, timed exactly like exam day — not a synthetic approximation.",
  },
  {
    icon: BookOpenCheck,
    title: "Everyday practice exercises",
    description: "Drill by subject or difficulty, plus a daily challenge — kept separate from past exam papers, for regular practice.",
  },
  {
    icon: Sparkles,
    title: "Personalized explanations",
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
  { title: "Review, learn, and track your progress", description: "Get instant results, personalized explanations for what you missed, and a dashboard that shows how you're improving." },
];

export default async function HomePage() {
  // A signed-in visitor doesn't need the register/sign-up CTAs — same
  // reasoning as the marketing layout's header (see its comment).
  const user = await getCurrentUser();

  return (
    <div>
      <section className="border-b bg-linear-to-b from-[oklch(0.8_0.07_255.195)] to-background dark:from-[oklch(0.32_0.08_255.195)]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">CSCA Prep</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Prepare for the CSCA with confidence
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real past exam papers, everyday practice exercises, and personalized explanations built specifically for
            international students preparing for the CSCA and admission to Chinese universities.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Button size="lg" nativeButton={false} render={<Link href={ROLE_HOME_ROUTE[user.role]}>Go to your dashboard</Link>} />
            ) : (
              <Button size="lg" nativeButton={false} render={<Link href="/register">Start practicing free</Link>} />
            )}
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/pricing">See pricing</Link>} />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          {user ? (
            <>
              <h2 className="text-2xl font-semibold tracking-tight">Ready to keep going?</h2>
              <p className="mt-2 text-primary-foreground/80">Jump back into your dashboard and take your next mock exam.</p>
              <div className="mt-6">
                <Button size="lg" variant="secondary" nativeButton={false} render={<Link href={ROLE_HOME_ROUTE[user.role]}>Go to your dashboard</Link>} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold tracking-tight">Ready to start preparing?</h2>
              <p className="mt-2 text-primary-foreground/80">Create your free account and take your first mock exam today.</p>
              <div className="mt-6">
                <Button size="lg" variant="secondary" nativeButton={false} render={<Link href="/register">Get started free</Link>} />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
