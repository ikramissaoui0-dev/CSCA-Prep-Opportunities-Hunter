import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How It Works — CSCA Prep",
  description: "How CSCA Prep's mock exams, personalized explanations, and progress tracking work together to help you prepare for the CSCA.",
  alternates: { canonical: "/how-it-works" },
};

const EXAM_MODES = [
  { title: "Full CSCA simulation", description: "A complete, timed mock exam matching the real format — the closest thing to sitting the actual test." },
  { title: "Practice by subject", description: "Pick a subject and drill it specifically, at a question count you choose." },
  { title: "Practice by difficulty", description: "Target easy, medium, or hard questions when you want to build confidence or push your ceiling." },
  { title: "Daily challenge", description: "A short set of questions, refreshed daily, to build a consistent practice habit." },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-14 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">How it works</h1>
        <p className="mt-3 text-muted-foreground">From your first practice question to a full mock exam, here&apos;s what happens at every step.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">1. Choose how you want to practice</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {EXAM_MODES.map((mode) => (
            <Card key={mode.title}>
              <CardHeader>
                <CardTitle className="text-base">{mode.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{mode.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">2. Take the exam, distraction-free</h2>
        <p className="text-muted-foreground">
          Every session is timed and auto-submits the moment time runs out, so there&apos;s no ambiguity about the rules.
          Multiple-choice questions grade instantly; free-response answers are graded automatically once you submit.
          Your progress saves as you go, so a dropped connection never costs you an attempt.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">3. Review what you missed — with real explanations</h2>
        <p className="text-muted-foreground">
          After submitting, you get your score immediately, broken down by subject. For anything you missed, you can
          request a detailed explanation on the spot: why the correct answer is right, and why yours wasn&apos;t —
          not just an answer key.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">4. Watch your progress build</h2>
        <p className="text-muted-foreground">
          Your dashboard tracks your score trend over time and highlights your weakest subjects, so your next study
          session has a clear target instead of a guess. Consistent practice earns points, streaks, and badges along
          the way — small, visible proof that the work is paying off.
        </p>
      </section>

      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <p className="font-medium">See it in action.</p>
        <div className="mt-4">
          <Button nativeButton={false} render={<Link href="/register">Start practicing free</Link>} />
        </div>
      </div>
    </div>
  );
}
