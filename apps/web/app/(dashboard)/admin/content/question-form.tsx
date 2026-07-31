"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createQuestion, updateQuestion } from "./actions";
import type { TaxonomySubject, QuestionForEdit } from "@/server/queries/admin-content";

type OptionState = { id?: string; content: string; isCorrect: boolean };
type AttachmentState = { url: string; name: string };

export function QuestionForm({ taxonomy, initialData }: { taxonomy: TaxonomySubject[]; initialData?: QuestionForEdit }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const initialSubjectId = initialData ? (taxonomy.find((s) => s.categories.some((c) => c.id === initialData.categoryId))?.id ?? "") : "";

  const [subjectId, setSubjectId] = useState(initialSubjectId);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [difficultyPct, setDifficultyPct] = useState(Math.round((initialData?.difficulty ?? 0.5) * 100));
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [attachments, setAttachments] = useState<AttachmentState[]>(initialData?.attachments ?? []);
  const [explanation, setExplanation] = useState(initialData?.authorExplanation ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [options, setOptions] = useState<OptionState[]>(
    initialData?.options.map((o) => ({ id: o.id, content: o.content, isCorrect: o.isCorrect })) ?? [
      { content: "", isCorrect: true },
      { content: "", isCorrect: false },
    ],
  );

  const categories = taxonomy.find((s) => s.id === subjectId)?.categories ?? [];

  function updateOption(index: number, patch: Partial<OptionState>) {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  }
  function setCorrect(index: number) {
    setOptions((prev) => prev.map((o, i) => ({ ...o, isCorrect: i === index })));
  }
  function addOption() {
    setOptions((prev) => [...prev, { content: "", isCorrect: false }]);
  }
  function removeOption(index: number) {
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Removing the correct option would leave none marked — fall back
      // to the first remaining one rather than silently allowing zero.
      if (!next.some((o) => o.isCorrect) && next.length > 0) next[0]!.isCorrect = true;
      return next;
    });
  }
  function addAttachment() {
    setAttachments((prev) => [...prev, { url: "", name: "" }]);
  }
  function updateAttachment(index: number, patch: Partial<AttachmentState>) {
    setAttachments((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  }
  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const input = {
      id: initialData?.id,
      title,
      body,
      categoryId,
      difficulty: difficultyPct / 100,
      imageUrl,
      attachments: attachments.filter((a) => a.url.trim() && a.name.trim()),
      authorExplanation: explanation,
      isPublished,
      options,
    };

    startTransition(async () => {
      const result = initialData ? await updateQuestion(input) : await createQuestion(input);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push("/admin/content");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">Question body</Label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
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
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setCategoryId("");
                }}
                required
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Choose a subject
                </option>
                {taxonomy.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Topic</Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                disabled={!subjectId}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="difficulty">Difficulty — {difficultyPct}%</Label>
            <input
              id="difficulty"
              type="range"
              min={0}
              max={100}
              step={5}
              value={difficultyPct}
              onChange={(e) => setDifficultyPct(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Answer options</CardTitle>
          <CardDescription>Mark exactly one option as correct.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={String(options.findIndex((o) => o.isCorrect))}
            onValueChange={(value) => setCorrect(Number(value as string))}
          >
            {options.map((option, index) => (
              <div key={option.id ?? `new-${index}`} className="flex items-center gap-3">
                <RadioGroupItem value={String(index)} id={`correct-${index}`} />
                <Input
                  value={option.content}
                  onChange={(e) => updateOption(index, { content: e.target.value })}
                  placeholder={`Option ${index + 1}`}
                  required
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeOption(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>
          {options.length < 8 && (
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              Add option
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explanation &amp; media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="explanation">Explanation</Label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              placeholder="Shown to students after they answer."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-2">
            <Label>Attachments</Label>
            {attachments.map((att, index) => (
              <div key={index} className="flex gap-2">
                <Input value={att.name} onChange={(e) => updateAttachment(index, { name: e.target.value })} placeholder="Label" className="w-40" />
                <Input
                  value={att.url}
                  onChange={(e) => updateAttachment(index, { url: e.target.value })}
                  placeholder="https://…"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeAttachment(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addAttachment}>
              Add attachment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-sm text-muted-foreground">Only published questions can appear in exams.</p>
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
          {isPending ? "Saving…" : initialData ? "Save changes" : "Create question"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/content")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
