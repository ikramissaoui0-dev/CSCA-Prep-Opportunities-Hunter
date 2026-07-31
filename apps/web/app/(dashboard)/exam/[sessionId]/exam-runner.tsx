"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { saveAnswer, submitExam, logTabSwitch } from "../actions";
import type { ExamTakingQuestion, ExamTakingAnswer } from "@/server/queries/exam-session";

// A free-response answer autosaves on a pause in typing, not on every
// keystroke — the same answer would otherwise mean one write (and, once
// AI grading runs, no extra cost since grading happens once at submit
// time either way) per character typed.
const FREE_RESPONSE_SAVE_DEBOUNCE_MS = 800;

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ExamRunner({
  sessionId,
  startedAtMs,
  timeLimitSeconds,
  questions,
  initialAnswers,
}: {
  sessionId: string;
  startedAtMs: number;
  timeLimitSeconds: number | null;
  questions: ExamTakingQuestion[];
  initialAnswers: Record<string, ExamTakingAnswer>;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ExamTakingAnswer>>(initialAnswers);
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasAutoSubmitted = useRef(false);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const deadlineMs = useMemo(() => (timeLimitSeconds === null ? null : startedAtMs + timeLimitSeconds * 1000), [startedAtMs, timeLimitSeconds]);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    deadlineMs === null ? null : Math.max(0, Math.round((deadlineMs - Date.now()) / 1000)),
  );

  const doSubmit = useCallback(() => {
    if (hasAutoSubmitted.current) return;
    hasAutoSubmitted.current = true;
    setIsSubmitting(true);
    void submitExam(sessionId);
  }, [sessionId]);

  // Countdown — ticks every second; auto-submits exactly once at zero.
  useEffect(() => {
    if (deadlineMs === null) return;
    const interval = setInterval(() => {
      const next = Math.max(0, Math.round((deadlineMs - Date.now()) / 1000));
      setRemainingSeconds(next);
      if (next <= 0) {
        clearInterval(interval);
        doSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadlineMs, doSubmit]);

  // Basic anti-cheat telemetry (Phase 4): report when this tab loses
  // focus. Logged for staff visibility, not enforced.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        void logTabSwitch(sessionId);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [sessionId]);

  // Flush any pending debounced free-response saves on unmount rather
  // than losing the last few keystrokes if a student navigates away.
  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      for (const timer of Object.values(timers)) clearTimeout(timer);
    };
  }, []);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.values(answers).filter((a) => a.selectedOptionId || a.freeResponseText).length;

  function persistAnswer(questionId: string, input: { selectedOptionId: string } | { freeResponseText: string }) {
    void saveAnswer({ sessionId, questionId, ...input }).then((result) => {
      if (!result.success) {
        setSaveErrors((prev) => ({ ...prev, [questionId]: result.message }));
        if (result.code === "VALIDATION_ERROR" && result.message.toLowerCase().includes("time")) {
          router.push(`/exam/${sessionId}/results`);
        }
      }
    });
  }

  function handleSelectOption(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: { selectedOptionId: optionId } }));
    setSaveErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    persistAnswer(questionId, { selectedOptionId: optionId });
  }

  function handleFreeResponseChange(questionId: string, text: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: { freeResponseText: text } }));
    setSaveErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });

    clearTimeout(debounceTimers.current[questionId]);
    debounceTimers.current[questionId] = setTimeout(() => {
      if (text.trim().length > 0) {
        persistAnswer(questionId, { freeResponseText: text });
      }
    }, FREE_RESPONSE_SAVE_DEBOUNCE_MS);
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No questions in this exam</CardTitle>
          <CardDescription>Please go back and choose a different exam.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length} · {answeredCount} answered
        </p>
        {remainingSeconds !== null && (
          <span
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-sm tabular-nums",
              remainingSeconds <= 60 ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-muted/50",
            )}
            aria-live="polite"
          >
            {formatTime(remainingSeconds)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const answered = Boolean(answers[q.id]?.selectedOptionId || answers[q.id]?.freeResponseText);
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-current={i === currentIndex}
              aria-label={`Question ${i + 1}${answered ? ", answered" : ", not answered"}`}
              className={cn(
                "flex size-8 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
                i === currentIndex && "border-primary ring-2 ring-primary/30",
                answered ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{currentQuestion.title}</CardTitle>
          <CardDescription className="text-foreground">{currentQuestion.body}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentQuestion.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- remote content images aren't in next.config's static image pipeline
            <img src={currentQuestion.imageUrl} alt="" className="mb-4 max-h-64 rounded-md border object-contain" />
          )}
          {currentQuestion.type === "free_response" ? (
            <div className="space-y-1.5">
              <Textarea
                key={currentQuestion.id}
                defaultValue={answers[currentQuestion.id]?.freeResponseText ?? ""}
                onChange={(e) => handleFreeResponseChange(currentQuestion.id, e.target.value)}
                placeholder="Write your answer…"
                rows={6}
              />
              <p className="text-xs text-muted-foreground">Graded automatically once you submit the exam.</p>
            </div>
          ) : (
            <RadioGroup
              value={answers[currentQuestion.id]?.selectedOptionId ?? ""}
              onValueChange={(value) => handleSelectOption(currentQuestion.id, value as string)}
            >
              {currentQuestion.options.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={`option-${option.id}`}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-normal has-data-checked:border-primary has-data-checked:bg-primary/5"
                >
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  {option.content}
                </Label>
              ))}
            </RadioGroup>
          )}
          {saveErrors[currentQuestion.id] && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {saveErrors[currentQuestion.id]}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
          Previous
        </Button>

        {isLastQuestion ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit exam"}</Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit this exam?</AlertDialogTitle>
                <AlertDialogDescription>
                  You&apos;ve answered {answeredCount} of {questions.length} questions. Once submitted, you can&apos;t change
                  your answers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
                <AlertDialogAction onClick={doSubmit}>Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}>Next</Button>
        )}
      </div>
    </div>
  );
}
