"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startExam } from "./actions";
import type { StartExamInput } from "@/lib/validation/exam";

function useStartExam() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(input: StartExamInput) {
    setError(null);
    startTransition(async () => {
      const result = await startExam(input);
      // startExam redirects on success and never returns past that point —
      // reaching here with a value at all means it failed.
      if (result && !result.success) {
        setError(result.message);
      }
    });
  }

  return { run, isPending, error };
}

export function StartCuratedExamButton({
  examId,
  mode,
  label = "Start",
}: {
  examId: string;
  mode: "full_mock" | "daily_challenge";
  label?: string;
}) {
  const { run, isPending, error } = useStartExam();
  return (
    <div className="space-y-2">
      <Button onClick={() => run({ mode, examId })} disabled={isPending}>
        {isPending ? "Starting…" : label}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type PracticeTopic = { id: string; name: string; subtopics: { id: string; name: string }[] };

export function StartSubjectPracticeForm({
  subjects,
}: {
  subjects: { id: string; name: string; topics: PracticeTopic[] }[];
}) {
  const { run, isPending, error } = useStartExam();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [topicId, setTopicId] = useState(""); // "" = every topic in the subject
  const [subtopicId, setSubtopicId] = useState(""); // "" = every subtopic within topicId
  const [questionCount, setQuestionCount] = useState(10);

  if (subjects.length === 0) {
    return <p className="text-sm text-muted-foreground">No subjects available yet.</p>;
  }

  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];
  const subtopics = topics.find((t) => t.id === topicId)?.subtopics ?? [];
  // The most specific choice wins: a subtopic if one's picked, otherwise
  // the topic itself (which may be a group with no direct questions of
  // its own — startExamCore expands a group to all its subtopics).
  const categoryId = subtopicId || topicId || undefined;

  function handleSubjectChange(nextSubjectId: string) {
    setSubjectId(nextSubjectId);
    setTopicId(""); // topic list changed — a previously picked id may not exist here
    setSubtopicId("");
  }

  function handleTopicChange(nextTopicId: string) {
    setTopicId(nextTopicId);
    setSubtopicId(""); // subtopic list changed along with it
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="space-y-1.5">
          <Label htmlFor="subject-select">Subject</Label>
          <select
            id="subject-select"
            value={subjectId}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="subject-count">Questions</Label>
          <Input
            id="subject-count"
            type="number"
            min={5}
            max={50}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
      {topics.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="topic-select">Topic</Label>
          <select
            id="topic-select"
            value={topicId}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {subtopics.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="subtopic-select">More specifically</Label>
          <select
            id="subtopic-select"
            value={subtopicId}
            onChange={(e) => setSubtopicId(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All of {topics.find((t) => t.id === topicId)?.name}</option>
            {subtopics.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <Button
        onClick={() => run({ mode: "subject_practice", subjectId, categoryId, questionCount })}
        disabled={isPending || !subjectId}
      >
        {isPending ? "Starting…" : "Start practice"}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const DIFFICULTY_PRESETS = [
  { label: "Easy", min: 0, max: 0.4 },
  { label: "Medium", min: 0.4, max: 0.7 },
  { label: "Hard", min: 0.7, max: 1 },
] as const;

export function StartDifficultyPracticeForm() {
  const { run, isPending, error } = useStartExam();
  const [preset, setPreset] = useState<(typeof DIFFICULTY_PRESETS)[number]>(DIFFICULTY_PRESETS[1]);
  const [questionCount, setQuestionCount] = useState(10);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {DIFFICULTY_PRESETS.map((p) => (
          <Button key={p.label} type="button" size="sm" variant={p.label === preset.label ? "default" : "outline"} onClick={() => setPreset(p)}>
            {p.label}
          </Button>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="difficulty-count">Questions</Label>
        <Input
          id="difficulty-count"
          type="number"
          min={5}
          max={50}
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-24"
        />
      </div>
      <Button
        onClick={() => run({ mode: "difficulty_practice", difficultyMin: preset.min, difficultyMax: preset.max, questionCount })}
        disabled={isPending}
      >
        {isPending ? "Starting…" : "Start practice"}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
