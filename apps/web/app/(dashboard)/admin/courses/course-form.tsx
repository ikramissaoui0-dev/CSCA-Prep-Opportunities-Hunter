"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCourse, updateCourse } from "./actions";
import type { TaxonomySubject } from "@/server/queries/admin-content";
import type { CourseForEdit } from "@/server/queries/admin-courses";

export function CourseForm({ subjects, initialData }: { subjects: TaxonomySubject[]; initialData?: CourseForEdit }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [subjectId, setSubjectId] = useState(initialData?.subjectId ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? "");
  const [requiredPlanTier, setRequiredPlanTier] = useState<"free" | "premium" | "premium_plus">(
    initialData?.requiredPlanTier ?? "premium_plus",
  );
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const input = { id: initialData?.id, title, subjectId, description, coverImageUrl, requiredPlanTier, isPublished, displayOrder };

    startTransition(async () => {
      const result = initialData ? await updateCourse(input) : await createCourse(input);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push(initialData ? `/admin/courses/${initialData.id}` : `/admin/courses/${result.data.courseId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">No subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="plan">Required plan</Label>
              <select
                id="plan"
                value={requiredPlanTier}
                onChange={(e) => setRequiredPlanTier(e.target.value as typeof requiredPlanTier)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="premium_plus">Premium+</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="coverImageUrl">Cover image URL</Label>
              <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="displayOrder">Display order</Label>
              <Input
                id="displayOrder"
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-sm text-muted-foreground">Only published courses (with at least one plan-eligible student) are visible.</p>
          </div>
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : initialData ? "Save changes" : "Create course"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/courses")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
