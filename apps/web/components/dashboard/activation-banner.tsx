"use client";

import { useEffect, useState } from "react";
import { dismissActivationBanner } from "@/app/(dashboard)/student/actions";

const TIER_LABEL: Record<string, string> = { premium: "Premium", premium_plus: "Premium+" };

/**
 * Shown exactly once, right after an admin-granted free access record
 * links to this student's account (either because they already had one
 * when granted, or because they just registered with an authorized
 * email). Marks itself seen on mount — a page refresh must never bring
 * it back. Never says "free" per this feature's own spec: a
 * professionally-worded "access is active" reads the same whether
 * they're paying or not.
 */
export function ActivationBanner({ grantId, grantedTier }: { grantId: string; grantedTier: string }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    void dismissActivationBanner(grantId);
  }, [grantId]);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div>
        <p className="font-medium">CSCAprepa Access — Active</p>
        <p className="text-sm text-muted-foreground">
          Your CSCAprepa access has been activated ({TIER_LABEL[grantedTier] ?? grantedTier}). Enjoy full access to
          mock exams, courses, and detailed explanations.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-sm text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}
