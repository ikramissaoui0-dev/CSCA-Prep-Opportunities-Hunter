"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Route-segment error boundary. Catches errors thrown during rendering in
 * Server or Client Components below this point in the tree; does not
 * catch errors from Server Actions (those return ActionResult instead —
 * see lib/errors.ts) or from Route Handlers.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled route error", { digest: error.digest, message: error.message });
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        We hit an unexpected error loading this page. It&apos;s been logged — try again, or head back to your
        dashboard.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
