"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createLesson, updateLesson } from "../actions";
import type { TaxonomySubject } from "@/server/queries/admin-content";
import type { LessonRow } from "@/server/queries/admin-courses";

type ContentType = "video" | "pdf" | "notes" | "exercise";

export function LessonForm({
  courseId,
  taxonomy,
  initialData,
  onDone,
}: {
  courseId: string;
  taxonomy: TaxonomySubject[];
  initialData?: LessonRow;
  onDone: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [contentType, setContentType] = useState<ContentType>(initialData?.contentType ?? "video");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? "");
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl ?? "");
  const [notesBody, setNotesBody] = useState(initialData?.notesBody ?? "");
  const [exerciseCategoryId, setExerciseCategoryId] = useState(initialData?.exerciseCategoryId ?? "");
  const [durationMinutes, setDurationMinutes] = useState<number | "">(
    initialData?.durationSeconds ? Math.round(initialData.durationSeconds / 60) : "",
  );
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);

  const allCategories = taxonomy.flatMap((s) => s.categories.map((c) => ({ ...c, subjectName: s.name })));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const input = {
      id: initialData?.id,
      courseId,
      title,
      contentType,
      videoUrl,
      pdfUrl,
      notesBody,
      exerciseCategoryId,
      durationMinutes: durationMinutes === "" ? null : durationMinutes,
      isPublished,
    };

    startTransition(async () => {
      const result = initialData ? await updateLesson(input) : await createLesson(input);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.refresh();
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lessonTitle">Title</Label>
          <Input id="lessonTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contentType">Content type</Label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="notes">Notes</option>
            <option value="exercise">Exercise</option>
          </select>
        </div>
      </div>

      {contentType === "video" && (
        <div className="space-y-1.5">
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" required />
        </div>
      )}
      {contentType === "pdf" && (
        <div className="space-y-1.5">
          <Label htmlFor="pdfUrl">PDF URL</Label>
          <Input id="pdfUrl" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://…" required />
        </div>
      )}
      {contentType === "notes" && (
        <div className="space-y-1.5">
          <Label htmlFor="notesBody">Notes</Label>
          <textarea
            id="notesBody"
            value={notesBody}
            onChange={(e) => setNotesBody(e.target.value)}
            rows={4}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      )}
      {contentType === "exercise" && (
        <div className="space-y-1.5">
          <Label htmlFor="exerciseCategoryId">Topic</Label>
          <select
            id="exerciseCategoryId"
            value={exerciseCategoryId}
            onChange={(e) => setExerciseCategoryId(e.target.value)}
            required
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {allCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subjectName} / {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="durationMinutes">Duration (minutes)</Label>
          <Input
            id="durationMinutes"
            type="number"
            min={0}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Optional"
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md border p-2.5">
          <span className="text-sm">Published</span>
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : initialData ? "Save lesson" : "Add lesson"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
