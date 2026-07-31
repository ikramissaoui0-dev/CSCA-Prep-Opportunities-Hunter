"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { deleteLesson, setLessonPublished, moveLesson } from "../actions";
import { LessonForm } from "./lesson-form";
import type { TaxonomySubject } from "@/server/queries/admin-content";
import type { LessonRow } from "@/server/queries/admin-courses";

const CONTENT_TYPE_LABEL: Record<string, string> = { video: "Video", pdf: "PDF", notes: "Notes", exercise: "Exercise" };

// Props are the source of truth: mutations call revalidatePath, which
// re-renders the parent Server Component and pushes fresh `lessons` down
// — mirroring them into local state here would go stale after the first
// edit, since useState only reads its initializer once.
export function LessonsManager({
  courseId,
  lessons,
  taxonomy,
}: {
  courseId: string;
  lessons: LessonRow[];
  taxonomy: TaxonomySubject[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  function handleTogglePublish(lessonId: string, isPublished: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await setLessonPublished(lessonId, courseId, !isPublished);
      if (!result.success) setError(result.message);
    });
  }

  function handleDelete(lessonId: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteLesson(lessonId, courseId);
      if (!result.success) setError(result.message);
    });
  }

  function handleMove(lessonId: string, direction: -1 | 1) {
    setError(null);
    startTransition(async () => {
      const result = await moveLesson(lessonId, courseId, direction);
      if (!result.success) setError(result.message);
    });
  }

  return (
    <div className="space-y-3">
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">No lessons yet.</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((lesson, index) =>
            editingId === lesson.id ? (
              <LessonForm key={lesson.id} courseId={courseId} taxonomy={taxonomy} initialData={lesson} onDone={() => setEditingId(null)} />
            ) : (
              <li key={lesson.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
                <div>
                  <p className="font-medium">
                    {index + 1}. {lesson.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CONTENT_TYPE_LABEL[lesson.contentType]}
                    {lesson.durationSeconds ? ` · ${Math.round(lesson.durationSeconds / 60)} min` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={lesson.isPublished ? "default" : "secondary"}>{lesson.isPublished ? "Published" : "Draft"}</Badge>
                  <Button size="sm" variant="outline" onClick={() => handleMove(lesson.id, -1)} disabled={isPending || index === 0}>
                    Up
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMove(lesson.id, 1)}
                    disabled={isPending || index === lessons.length - 1}
                  >
                    Down
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(lesson.id)} disabled={isPending}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTogglePublish(lesson.id, lesson.isPublished)} disabled={isPending}>
                    {lesson.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button size="sm" variant="outline" disabled={isPending}>Delete</Button>} />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this lesson?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This deletes any students&apos; progress on it too. This can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(lesson.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {isAdding ? (
        <LessonForm
          courseId={courseId}
          taxonomy={taxonomy}
          onDone={() => {
            setIsAdding(false);
            router.refresh();
          }}
        />
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(true)}>
          Add lesson
        </Button>
      )}
    </div>
  );
}
