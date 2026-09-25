import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Exam Guide — CSCA Prep",
  description:
    "A practical breakdown of the CSCA exam: what it tests, how it's structured, when it runs, what it costs, and how to walk in ready.",
  alternates: { canonical: "/exam-guide" },
};

const SUBJECTS = [
  { subject: "Mathematics", language: "Chinese or English", duration: "60 min", questions: "48 MCQ" },
  { subject: "Physics", language: "Chinese or English", duration: "60 min", questions: "48 MCQ" },
  { subject: "Chemistry", language: "Chinese or English", duration: "60 min", questions: "48 MCQ" },
  { subject: "Professional Chinese", language: "Chinese only", duration: "90 min", questions: "80 MCQ" },
];

const EXAM_DAY_SCHEDULE = [
  { subject: "Professional Chinese", time: "12:00 – 13:30" },
  { subject: "Physics", time: "15:00 – 16:00" },
  { subject: "Mathematics", time: "18:00 – 19:00" },
  { subject: "Chemistry", time: "20:30 – 21:30" },
];

const SUBJECT_CHOICE = [
  {
    title: "Applying for a CSC scholarship",
    body: "Professional Chinese plus Mathematics is the combination most commonly asked for. Science and engineering majors are often asked for Physics or Chemistry on top of that — but the scholarship channel and the university both drive the final list, so check both before you register.",
  },
  {
    title: "Applying and paying your own way",
    body: "Here it depends even more on the specific program: the teaching language, the university, and your major all factor in. Medicine, engineering, and the sciences generally pull in Mathematics, Physics, or Chemistry.",
  },
];

const SYLLABUS = [
  { subject: "Mathematics", topics: ["Algebra and functions", "Calculus", "Geometry", "Probability and statistics"] },
  { subject: "Physics", topics: ["Mechanics", "Electricity and magnetism", "Optics", "Modern physics"] },
  { subject: "Chemistry", topics: ["Organic chemistry", "Inorganic chemistry", "Physical chemistry", "Chemical reactions"] },
];

const PREP_APPROACH = [
  {
    title: "Find out where you actually stand",
    body: "Run a diagnostic across each subject before you commit to a study plan. Most students assume they're weaker (or stronger) somewhere than they really are — a few real questions per topic settles it fast.",
  },
  {
    title: "Study the exam, not the textbook",
    body: "Past papers repeat the same high-yield topics far more than any syllabus list suggests. Drilling those topics specifically moves your score more than reviewing chapters in order.",
  },
  {
    title: "Keep a running list of what trips you up",
    body: "Every missed question goes on the list until you can solve it cold. That list, revisited often, is usually the fastest source of extra points in the final weeks.",
  },
  {
    title: "Rehearse the real thing",
    body: "Timing yourself on full-length simulations is the only way to know if your pace holds up under the actual clock — reading a worked solution later is not the same skill as solving it live.",
  },
];

export default function ExamGuidePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">
      <div>
        <Badge variant="secondary" className="mb-3">
          Exam guide
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">What the CSCA actually involves</h1>
        <p className="mt-3 text-muted-foreground">
          The China Scholastic Competency Assessment (CSCA) is how Chinese universities screen international
          applicants for undergraduate admission. It's the same idea as an SAT or A-Level in other systems: a
          standardized score universities can compare across very different applicant backgrounds.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          One thing to keep in mind throughout this page: the CSCA itself is standardized, but which subjects you
          need and what score counts as competitive is decided separately by each university and program. Treat the
          numbers below as the framework, and confirm the specifics for your target school directly with them or via{" "}
          <a href="https://csca.cn" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            csca.cn
          </a>
          .
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">What's tested, and how</h2>
        <p className="text-muted-foreground">
          Mathematics, Physics, and Chemistry are each 48 multiple-choice questions in a 60-minute window, and you can
          sit any of them in either Chinese or English. Professional Chinese runs longer — 80 questions in 90 minutes
          — and is Chinese-only, since testing your Chinese proficiency is the point. Every subject is scored
          independently on a 0–100 scale, so a weak subject doesn't drag down a strong one.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Language</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {SUBJECTS.map((row) => (
                <tr key={row.subject}>
                  <td className="px-4 py-3 font-medium">{row.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.language}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.duration}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.questions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          The exam itself is taken remotely — at home, on a computer, or on paper depending on what's offered for
          your session and region. It's not a physical test-center exam the way many other admissions tests are.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">If you're sitting more than one subject</h2>
        <p className="text-muted-foreground">
          Multi-subject candidates don't take everything back-to-back — the subjects are spread out across the day so
          you're not stacking four exams in a row. A typical layout, in Beijing time, looks like this:
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[360px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Beijing time</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {EXAM_DAY_SCHEDULE.map((row) => (
                <tr key={row.subject}>
                  <td className="px-4 py-3 font-medium">{row.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Do the timezone math early — if you're testing from outside China, one of these slots will likely fall late
          at night or early morning your time. Confirm the actual timing for your session before exam day, since it
          can shift between sessions.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Dates and cost</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">When it runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Roughly five sessions a year — January, March, April, June, and December.</p>
              <p>Registration opens on csca.cn a few weeks ahead of each one, so it's worth checking back regularly if you don't have a date yet.</p>
              <p>Results land within about a week for computer-based sittings, or two weeks if you sat on paper.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What it costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">¥450 CNY</span> for one subject.
              </p>
              <p>
                <span className="font-medium text-foreground">¥700 CNY</span> flat if you're sitting two or more.
              </p>
              <p>Alipay, WeChat Pay, and bank transfer are all accepted at registration.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Figuring out which subjects you need</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SUBJECT_CHOICE.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          When in doubt, register for the exam that keeps your options widest — dropping a subject you didn't end up
          needing costs nothing; discovering too late that you're missing one can cost you an admissions cycle.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">What's actually on each subject</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {SYLLABUS.map((s) => (
            <Card key={s.subject}>
              <CardHeader>
                <CardTitle className="text-base">{s.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {s.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">How we'd approach studying for it</h2>
        <p className="text-muted-foreground">
          There's no shortage of generic exam advice out there. This is the version we actually built the platform
          around — each point below maps to something you can do inside CSCA Prep itself.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PREP_APPROACH.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          In practice: subject and difficulty practice cover the diagnostic and drilling, missed questions get
          AI-generated explanations instead of a bare answer key, and full timed simulations are what stand in for
          exam-day rehearsal. See{" "}
          <Link href="/how-it-works" className="underline hover:text-foreground">
            how it works
          </Link>{" "}
          for the details.
        </p>
      </section>

      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <p className="font-medium">Ready to see where you stand?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start with a free subject practice set — no credit card required, unlimited practice on the free plan.
        </p>
        <div className="mt-4">
          <Button nativeButton={false} render={<Link href="/register">Start practicing free</Link>} />
        </div>
      </div>
    </div>
  );
}
