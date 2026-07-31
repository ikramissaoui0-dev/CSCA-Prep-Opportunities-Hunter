"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
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
import { deleteExam, setExamPublished } from "./actions";

export function RowActions({ examId, isPublished }: { examId: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleTogglePublish() {
    setError(null);
    startTransition(async () => {
      const result = await setExamPublished(examId, !isPublished);
      if (!result.success) setError(result.message);
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteExam(examId);
      if (!result.success) setError(result.message);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleTogglePublish} disabled={isPending}>
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger render={<Button size="sm" variant="outline" disabled={isPending}>Delete</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this exam?</AlertDialogTitle>
              <AlertDialogDescription>
                This can&apos;t be undone. Exams already taken by students can&apos;t be deleted — unpublish them instead.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
