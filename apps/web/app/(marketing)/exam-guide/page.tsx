import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getCurrentUser } from "@/lib/auth/session";
import { ROLE_HOME_ROUTE } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "CSCA Exam Guide — Dates, Subjects, Format & Cost",
  description:
    "Everything about the CSCA exam: upcoming session dates, subjects and scoring (Math, Physics, Chemistry, Professional Chinese), exam format, cost, and how to prepare — sourced from the official CSCA schedule.",
  keywords: [
    "CSCA exam",
    "CSCA exam dates",
    "CSCA exam guide",
    "what is the CSCA",
    "CSCA subjects",
    "CSCA exam format",
    "CSCA exam cost",
  ],
  alternates: { canonical: "/exam-guide" },
  openGraph: {
    type: "article",
    title: "CSCA Exam Guide — Dates, Subjects, Format & Cost",
    description:
      "Everything about the CSCA exam: upcoming session dates, subjects and scoring, exam format, cost, and how to prepare — sourced from the official CSCA schedule.",
  },
};

const SUBJECTS = [
  { subject: "Mathematics", language: "Chinese or English", duration: "60 min", questions: "48 MCQ" },
  { subject: "Physics", language: "Chinese or English", duration: "60 min", questions: "48 MCQ" },
  { subject: "Chemistry", language: "Chinese or English", duration: "60 min", questions: "48 MCQ" },
  { subject: "Professional Chinese", language: "Chinese only", duration: "90 min", questions: "80 MCQ" },
];

// Sourced from csca.cn's "CSCA Test Schedule for November 2026 – June
// 2027" announcement (published 2026-09-24) — the only officially
// confirmed sessions as of this writing. Update this list once csca.cn
// publishes the next batch; don't extrapolate future dates.
const UPCOMING_SESSIONS = [
  { session: "November 2026", examDates: "Nov 14–15, 2026", registration: "Oct 15–21, 2026", status: "Registration opening soon" },
  { session: "December 2026", examDates: "Dec 19–20, 2026", registration: null, status: "Registration not yet open" },
  { session: "January 2027", examDates: "Jan 23–24, 2027", registration: null, status: "Registration not yet open" },
  { session: "March 2027", examDates: "Mar 13–14, 2027", registration: null, status: "Registration not yet open" },
  { session: "April 2027", examDates: "Apr 24–25, 2027", registration: null, status: "Registration not yet open" },
  { session: "June 2027", examDates: "Jun 26–27, 2027", registration: null, status: "Registration not yet open" },
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

export default async function ExamGuidePage() {
  // Same reasoning as the homepage/pricing fix: a signed-in visitor
  // shouldn't be funneled back through /register.
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">
      <div>
        <Badge variant="secondary" className="mb-3">
          Exam guide
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">The complete CSCA exam guide</h1>
        <p className="mt-3 text-muted-foreground">
          The China Scholastic Competency Assessment (CSCA) is how Chinese universities screen international
          applicants for undergraduate admission. It&apos;s the same idea as an SAT or A-Level in other systems: a
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
        <h2 className="text-xl font-semibold tracking-tight">What&apos;s tested, and how</h2>
        <p className="text-muted-foreground">
          Mathematics, Physics, and Chemistry are each 48 multiple-choice questions in a 60-minute window, and you can
          sit any of them in either Chinese or English. Professional Chinese runs longer — 80 questions in 90 minutes
          — and is Chinese-only, since testing your Chinese proficiency is the point. Every subject is scored
          independently on a 0–100 scale, so a weak subject doesn&apos;t drag down a strong one.
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
          Professional Chinese actually comes in two versions — Humanities and STEM — and your target university or
          program decides which one you need, not you. Confirm the right one before you register.
        </p>
        <p className="text-sm text-muted-foreground">
          The exam is mostly taken at home, online, on a computer. Onsite computer-based test centers are gradually
          being added in key countries and regions — there&apos;s no paper option either way.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">If you&apos;re sitting more than one subject</h2>
        <p className="text-muted-foreground">
          Each session runs across two days: Professional Chinese and Mathematics are held on Day 1, Physics and
          Chemistry on Day 2. Depending on the session, the first subject of the day starts at either 08:00 or 14:00
          Beijing time — csca.cn publishes the exact per-subject start times for each session ahead of registration,
          and your admission ticket has the final word.
        </p>
        <p className="text-sm text-muted-foreground">
          Home-based online exams and computer-based exams at physical test centers run at the same time, with the
          same content, duration, and scoring. Do the timezone math early — if you&apos;re testing from outside China,
          an 08:00 or 14:00 Beijing-time start will likely fall late at night or early morning where you are.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Upcoming sessions and cost</h2>
        <p className="text-muted-foreground">
          Every confirmed session through June 2027, straight from csca.cn&apos;s official schedule. Registration for
          each one typically opens on csca.cn a few weeks ahead — the two exam dates below are the same for both the
          home-based online exam and computer-based test centers.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Exam dates</th>
                <th className="px-4 py-3 font-medium">Registration</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {UPCOMING_SESSIONS.map((row) => (
                <tr key={row.session}>
                  <td className="px-4 py-3 font-medium">{row.session}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.examDates}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.registration ? `${row.registration} — ${row.status}` : row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          Results are released within 10 working days after the exam. Registration windows for sessions past January
          2027 haven&apos;t been announced yet — check{" "}
          <a href="https://csca.cn" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            csca.cn
          </a>{" "}
          directly as your session approaches.
        </p>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What it costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">¥450 CNY</span> for one subject.
            </p>
            <p>
              <span className="font-medium text-foreground">¥700 CNY</span> flat if you&apos;re sitting two or more.
            </p>
          </CardContent>
        </Card>
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
          When in doubt, register for the exam that keeps your options widest — dropping a subject you didn&apos;t end up
          needing costs nothing; discovering too late that you&apos;re missing one can cost you an admissions cycle.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">What&apos;s actually on each subject</h2>
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
        <h2 className="text-xl font-semibold tracking-tight">How we&apos;d approach studying for it</h2>
        <p className="text-muted-foreground">
          There&apos;s no shortage of generic exam advice out there. This is the version we actually built the platform
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
          detailed explanations instead of a bare answer key, and full timed simulations are what stand in for
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
          Start with a free practice series — no credit card required, one per subject on the free plan.
        </p>
        <div className="mt-4">
          {user ? (
            <Button nativeButton={false} render={<Link href={ROLE_HOME_ROUTE[user.role]}>Go to your dashboard</Link>} />
          ) : (
            <Button nativeButton={false} render={<Link href="/register">Start practicing free</Link>} />
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd({ name: "Exam Guide", path: "/exam-guide" })) }}
      />
    </div>
  );
}
