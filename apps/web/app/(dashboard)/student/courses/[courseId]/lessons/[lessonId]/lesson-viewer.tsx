"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { recordLessonAccess, addLessonTimeSpent, setLessonCompleted } from "../../../actions";
import { startExam } from "@/app/(dashboard)/exam/actions";
import type { LessonWithProgress } from "@/server/queries/courses";

// Sent once per interval while the lesson page stays open — a rough,
// good-enough measure of time spent (Phase 10's "track time spent"),
// not a precise watch-time tracker. Matches MAX_HEARTBEAT_SECONDS in
// progress-actions-core.ts, which also caps it server-side.
const HEARTBEAT_INTERVAL_MS = 30_000;
const HEARTBEAT_SECONDS = 30;

function getVideoEmbedUrl(url: string): { kind: "youtube" | "vimeo" | "direct"; src: string } {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (youtubeMatch) return { kind: "youtube", src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { kind: "vimeo", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  return { kind: "direct", src: url };
}

export function LessonViewer({
  courseId,
  courseTitle,
  lesson,
  previous,
  next,
}: {
  courseId: string;
  courseTitle: string;
  lesson: LessonWithProgress;
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}) {
  const [isCompleted, setIsCompleted] = useState(!!lesson.completedAt);
  const [isPending, startTransition] = useTransition();
  const recordedAccess = useRef(false);

  useEffect(() => {
    if (recordedAccess.current) return;
    recordedAccess.current = true;
    void recordLessonAccess(lesson.id);
  }, [lesson.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      void addLessonTimeSpent(lesson.id, HEARTBEAT_SECONDS);
    }, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [lesson.id]);

  function handleToggleComplete() {
    const nextValue = !isCompleted;
    setIsCompleted(nextValue);
    startTransition(async () => {
      const result = await setLessonCompleted(lesson.id, nextValue);
      if (!result.success) setIsCompleted(!nextValue);
    });
  }

  function handlePracticeSubject(subjectId: string) {
    startTransition(async () => {
      await startExam({ mode: "subject_practice", subjectId, questionCount: 10 });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/student/courses/${courseId}`} className="text-sm text-muted-foreground hover:underline">
          ← {courseTitle}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          {lesson.contentType === "video" && lesson.videoUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              {(() => {
                const embed = getVideoEmbedUrl(lesson.videoUrl);
                return embed.kind === "direct" ? (
                  <video controls src={embed.src} className="h-full w-full" />
                ) : (
                  <iframe src={embed.src} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                );
              })()}
            </div>
          )}

          {lesson.contentType === "pdf" && lesson.pdfUrl && (
            <div className="space-y-2">
              <iframe src={lesson.pdfUrl} className="h-[600px] w-full rounded-lg border" />
              <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Open PDF in a new tab
              </a>
            </div>
          )}

          {lesson.contentType === "notes" && lesson.notesBody && (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{lesson.notesBody}</div>
          )}

          {lesson.contentType === "exercise" && lesson.exercise && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Practice questions from <strong>{lesson.exercise.subjectName}</strong> ({lesson.exercise.categoryName}).
              </p>
              <Button onClick={() => handlePracticeSubject(lesson.exercise!.subjectId)} disabled={isPending}>
                {isPending ? "Starting…" : "Start practice"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mark your progress</CardTitle>
          <CardDescription>Keep your course completion up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant={isCompleted ? "outline" : "default"} onClick={handleToggleComplete} disabled={isPending}>
            {isCompleted ? "Mark as not completed" : "Mark as completed"}
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        {previous ? (
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/student/courses/${courseId}/lessons/${previous.id}`}>← {previous.title}</Link>}
          />
        ) : (
          <span />
        )}
        {next && (
          <Button nativeButton={false} render={<Link href={`/student/courses/${courseId}/lessons/${next.id}`}>{next.title} →</Link>} />
        )}
      </div>
    </div>
  );
}
