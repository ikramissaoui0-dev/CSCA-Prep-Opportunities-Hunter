import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getPublishedCuratedExams, getSubjectsForPractice, getInProgressSessions, getUsedFreeSubjectIds } from "@/server/queries/exam-picker";
import { getCurrentPlanTier } from "@/lib/billing/plan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StartCuratedExamButton, StartSubjectPracticeForm, StartDifficultyPracticeForm } from "./start-controls";

export const metadata: Metadata = { title: "Take an exam — CSCA Prep" };

const MODE_LABEL: Record<string, string> = {
  full_mock: "Full simulation",
  subject_practice: "Subject practice",
  difficulty_practice: "Difficulty practice",
  daily_challenge: "Daily challenge",
};

export default async function ExamPickerPage() {
  const user = await requireRole("student", "admin");

  const [{ fullMocks, dailyChallenge }, subjects, inProgress, planTier] = await Promise.all([
    getPublishedCuratedExams(user.id, user.role),
    getSubjectsForPractice(user.id, user.role),
    getInProgressSessions(user.id, user.role),
    getCurrentPlanTier(user.id, user.role),
  ]);
  const isFreeTier = planTier === "free";
  // Only worth querying for a free account — a paid one has no
  // per-subject limit to check against.
  const usedSubjectIds = isFreeTier ? await getUsedFreeSubjectIds(user.id, user.role) : new Set<string>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Take an exam</h1>
        <p className="text-muted-foreground">Real past exam papers, kept separate from everyday practice exercises.</p>
      </div>

      {inProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Continue where you left off</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {inProgress.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{s.examTitle ?? "Practice session"}</p>
                  <Badge variant="secondary" className="font-normal">
                    {MODE_LABEL[s.mode] ?? s.mode}
                  </Badge>
                </div>
                <Button size="sm" nativeButton={false} render={<Link href={`/exam/${s.id}`}>Resume</Link>} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <section id="practice-exercises" className="space-y-3 scroll-mt-20">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Practice exercises</h2>
          <p className="text-sm text-muted-foreground">
            Practice questions organized by subject, topic, and difficulty — separate from the past exam papers, for
            everyday drilling.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily challenge</CardTitle>
            <CardDescription>A short set of questions, refreshed every day.</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyChallenge ? (
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{dailyChallenge.title}</p>
                  <p className="text-xs text-muted-foreground">{Math.round(dailyChallenge.timeLimitSeconds / 60)} minutes</p>
                </div>
                <StartCuratedExamButton examId={dailyChallenge.id} mode="daily_challenge" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No challenge has been published for today yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice by subject</CardTitle>
              <CardDescription>Focus on one subject at a time.</CardDescription>
            </CardHeader>
            <CardContent>
              <StartSubjectPracticeForm subjects={subjects} isFreeTier={isFreeTier} usedSubjectIds={[...usedSubjectIds]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice by difficulty</CardTitle>
              <CardDescription>Target easy, medium, or hard questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <StartDifficultyPracticeForm isFreeTier={isFreeTier} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="past-exam-papers" className="space-y-3 scroll-mt-20">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Past exam papers</h2>
          <p className="text-sm text-muted-foreground">
            Real, past CSCA exams — the exact questions from an actual sitting, timed exactly like exam day.
            {isFreeTier && (
              <>
                {" "}
                Requires Premium access —{" "}
                <Link href="/contact" className="underline hover:text-foreground">
                  contact us
                </Link>{" "}
                to unlock it.
              </>
            )}
          </p>
        </div>
        <Card>
          <CardContent className="space-y-3">
            {fullMocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No past exam papers are published yet.</p>
            ) : (
              fullMocks.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{exam.title}</p>
                    {exam.description && <p className="text-sm text-muted-foreground">{exam.description}</p>}
                    <p className="text-xs text-muted-foreground">{Math.round(exam.timeLimitSeconds / 60)} minutes</p>
                  </div>
                  {isFreeTier ? (
                    <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/contact">Contact us</Link>} />
                  ) : (
                    <StartCuratedExamButton examId={exam.id} mode="full_mock" />
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
