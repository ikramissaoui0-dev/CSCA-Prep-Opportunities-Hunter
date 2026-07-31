"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { explainQuestion } from "../../actions";

export function ExplanationPanel({
  sessionId,
  questionId,
  cachedExplanation,
}: {
  sessionId: string;
  questionId: string;
  cachedExplanation: string | null;
}) {
  const [explanation, setExplanation] = useState(cachedExplanation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (explanation) {
    return <p className="rounded-md bg-muted/50 p-3 text-sm text-foreground">{explanation}</p>;
  }

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    const result = await explainQuestion({ sessionId, questionId });
    setIsLoading(false);
    if (result.success) {
      setExplanation(result.data.content);
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Thinking…" : "Get AI explanation"}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
