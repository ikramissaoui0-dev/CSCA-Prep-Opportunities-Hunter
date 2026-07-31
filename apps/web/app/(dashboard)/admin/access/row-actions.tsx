"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { revokeAccessGrant } from "./actions";
import { GrantAccessForm } from "./grant-form";
import type { AccessGrantRow } from "@/server/queries/admin-access-grants";

export function RowActions({ grant }: { grant: AccessGrantRow }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRevoke() {
    setError(null);
    startTransition(async () => {
      const result = await revokeAccessGrant(grant.id);
      if (!result.success) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  const isRevoked = grant.status === "revoked";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <GrantAccessForm existingGrant={grant} trigger={<Button size="sm" variant="outline" disabled={isRevoked}>Edit</Button>} />
        <AlertDialog>
          <AlertDialogTrigger render={<Button size="sm" variant="outline" disabled={isPending || isRevoked}>Revoke</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke free access for {grant.email}?</AlertDialogTitle>
              <AlertDialogDescription>
                They&apos;ll lose premium access immediately unless they have an active paid subscription. Their exam
                history, progress, and account are never affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRevoke}>Revoke</AlertDialogAction>
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
