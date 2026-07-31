import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Verify your email — CSCA Prep" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your inbox</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            "We sent you a confirmation link."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>Click the link in that email to activate your account, then sign in.</p>
        <p>
          Didn&apos;t get it? Check spam, or{" "}
          <Link href="/register" className="font-medium text-foreground hover:underline">
            try signing up again
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
