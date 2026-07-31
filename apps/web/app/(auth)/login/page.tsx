import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in — CSCA Prep" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { error, reset } = await searchParams;

  return (
    <div className="space-y-4">
      {reset === "success" && (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Your password has been updated. Sign in with your new password.
        </p>
      )}
      {error === "oauth_init_failed" && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Google sign-in couldn&apos;t be started. Please try again.
        </p>
      )}
      {error === "auth_callback_failed" && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          That link has expired or was already used. Please sign in again.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
