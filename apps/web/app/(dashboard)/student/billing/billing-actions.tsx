"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startCheckout, openBillingPortal } from "./actions";
import type { CheckoutPlan } from "@/lib/validation/billing";

export function UpgradeButton({ plan, label }: { plan: CheckoutPlan; label: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      // redirect() inside the action throws on success — this line only
      // returns at all when checkout couldn't be started.
      const result = await startCheckout(plan);
      if (result && !result.success) setError(result.message);
    });
  }

  return (
    <div className="space-y-1.5">
      <Button className="w-full" onClick={handleClick} disabled={isPending}>
        {isPending ? "Redirecting…" : label}
      </Button>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ManageBillingButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await openBillingPortal();
      if (result && !result.success) setError(result.message);
    });
  }

  return (
    <div className="space-y-1.5">
      <Button variant="outline" onClick={handleClick} disabled={isPending}>
        {isPending ? "Redirecting…" : "Manage billing"}
      </Button>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
