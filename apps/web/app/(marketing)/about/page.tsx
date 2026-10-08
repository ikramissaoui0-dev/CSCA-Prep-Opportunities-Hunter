import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getCurrentUser } from "@/lib/auth/session";
import { ROLE_HOME_ROUTE } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "About — CSCA Prep",
  description: "About CSCA Prep and the CSCA exam — what this platform was built to solve.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  // Same reasoning as the homepage/pricing fix: a signed-in visitor
  // shouldn't be funneled back through /register.
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">About CSCA Prep</h1>
        <p className="mt-3 text-muted-foreground">
          CSCA Prep is built for one specific group of students: international applicants preparing for the CSCA on
          their way to studying at a Chinese university.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Why we built this</h2>
        <p className="text-muted-foreground">
          Most exam-prep tools are built for a broad audience and then loosely adapted. We started from the opposite
          direction: what does a student preparing specifically for the CSCA actually need? The answer is realistic,
          timed mock exams that mirror the real format, practice that adapts to where a student is actually weak, and
          feedback that explains a wrong answer instead of just marking it incorrect.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">What we prioritize</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Data integrity.</strong> Your exam attempts and scores are never lost,
            even under a dropped connection mid-exam.
          </li>
          <li>
            <strong className="text-foreground">Answer-key protection.</strong> Correct answers are never sent to your
            browser before you submit — nothing to peek at mid-exam.
          </li>
          <li>
            <strong className="text-foreground">Explanations that actually help.</strong> When you miss a question, we
            explain why the right answer is right — and why yours wasn&apos;t — in plain language.
          </li>
          <li>
            <strong className="text-foreground">Honest free access.</strong> You can take real mock exams and see real
            results without paying anything, before you ever decide whether to upgrade.
          </li>
        </ul>
      </section>

      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <p className="font-medium">Ready to see it for yourself?</p>
        <div className="mt-4">
          {user ? (
            <Button nativeButton={false} render={<Link href={ROLE_HOME_ROUTE[user.role]}>Go to your dashboard</Link>} />
          ) : (
            <Button nativeButton={false} render={<Link href="/register">Start practicing free</Link>} />
          )}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ name: "About", path: "/about" })) }} />
    </div>
  );
}
