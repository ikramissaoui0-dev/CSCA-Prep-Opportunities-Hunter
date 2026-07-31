"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * Last-resort boundary — only fires when the root layout itself throws,
 * so it must render its own <html>/<body> (the normal layout isn't
 * mounted). Kept dependency-free (no shadcn/Tailwind classes assumed
 * safe) since this runs when something in the app shell may itself be broken.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global application error", { digest: error.digest, message: error.message });
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>CSCA Prep is temporarily unavailable</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          We&apos;ve logged the issue and are looking into it. Please try again in a moment.
        </p>
        <button
          onClick={() => reset()}
          style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
