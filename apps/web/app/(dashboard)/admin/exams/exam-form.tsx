"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createExam, updateExam, searchExamQuestions } from "./actions";
import type { TaxonomySubject } from "@/server/queries/admin-content";
import type { ExamForEdit, EligibleQuestionRow } from "@/server/queries/admin-exams";

type SelectedQuestion = { id: string; title: string; subjectName: string; categoryName: string };

export function ExamForm({ taxonomy, initialData }: { taxonomy: TaxonomySubject[]; initialData?: ExamForEdit }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSearching, startSearch] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [mode, setMode] = useState<"full_mock" | "daily_challenge">(initialData?.mode ?? "full_mock");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(initialData ? Math.round(initialData.timeLimitSeconds / 60) : 120);
  const [challengeDate, setChallengeDate] = useState(initialData?.challengeDate ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
  const [selected, setSelected] = useState<SelectedQuestion[]>(initialData?.questions ?? []);

  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [results, setResults] = useState<EligibleQuestionRow[]>([]);
  const [searched, setSearched] = useState(false);

  const selectedIds = new Set(selected.map((q) => q.id));

  function runSearch() {
    startSearch(async () => {
      const result = await searchExamQuestions({ search: search.trim() || undefined, subjectId: subjectId || undefined });
      setSearched(true);
      if (result.success) setResults(result.data);
    });
  }

  function addQuestion(q: EligibleQuestionRow) {
    if (selectedIds.has(q.id)) return;
    setSelected((prev) => [...prev, { id: q.id, title: q.title, subjectName: q.subjectName, categoryName: q.categoryName }]);
  }
  function removeQuestion(id: string) {
    setSelected((prev) => prev.filter((q) => q.id !== id));
  }
  function moveQuestion(index: number, direction: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const input = {
      id: initialData?.id,
      title,
      description,
      mode,
      timeLimitMinutes,
      challengeDate: mode === "daily_challenge" ? challengeDate : "",
      isPublished,
      questionIds: selected.map((q) => q.id),
    };

    startTransition(async () => {
      const result = initialData ? await updateExam(input) : await createExam(input);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.push("/admin/exams");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exam details</CardTitle>
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
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="mode">Mode</Label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as "full_mock" | "daily_challenge")}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="full_mock">Full simulation</option>
                <option value="daily_challenge">Daily challenge</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timeLimit">Time limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min={1}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                required
              />
            </div>
            {mode === "daily_challenge" && (
              <div className="space-y-1.5">
                <Label htmlFor="challengeDate">Challenge date</Label>
                <Input id="challengeDate" type="date" value={challengeDate} onChange={(e) => setChallengeDate(e.target.value)} required />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions</CardTitle>
          <CardDescription>Search the question bank and add questions in the order students will see them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1 space-y-1.5">
              <Label htmlFor="search">Search</Label>
              <Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All subjects</option>
                {taxonomy.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="button" variant="outline" onClick={runSearch} disabled={isSearching}>
              {isSearching ? "Searching…" : "Search"}
            </Button>
          </div>

          {searched && (
            <div className="rounded-lg border">
              {results.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">No published questions match.</p>
              ) : (
                <ul className="divide-y">
                  {results.map((q) => (
                    <li key={q.id} className="flex items-center justify-between gap-3 p-2.5 text-sm">
                      <div>
                        <p className="font-medium">{q.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {q.subjectName} / {q.categoryName}
                        </p>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={() => addQuestion(q)} disabled={selectedIds.has(q.id)}>
                        {selectedIds.has(q.id) ? "Added" : "Add"}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Selected ({selected.length})</Label>
            {selected.length === 0 ? (
              <p className="text-sm text-muted-foreground">No questions added yet.</p>
            ) : (
              <ul className="space-y-2">
                {selected.map((q, index) => (
                  <li key={q.id} className="flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm">
                    <div>
                      <p className="font-medium">
                        {index + 1}. {q.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {q.subjectName} / {q.categoryName}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button type="button" size="sm" variant="outline" onClick={() => moveQuestion(index, -1)} disabled={index === 0}>
                        Up
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => moveQuestion(index, 1)}
                        disabled={index === selected.length - 1}
                      >
                        Down
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => removeQuestion(q.id)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-sm text-muted-foreground">Only published exams are visible to students.</p>
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
          {isPending ? "Saving…" : initialData ? "Save changes" : "Create exam"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/exams")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
