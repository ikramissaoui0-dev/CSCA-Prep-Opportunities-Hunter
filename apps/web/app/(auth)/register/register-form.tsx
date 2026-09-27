"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PHONE_COUNTRY_CODES, DEFAULT_PHONE_COUNTRY_CODE, OTHER_PHONE_COUNTRY_VALUE } from "@/lib/phone-country-codes";

type FormState =
  | { success: false; message: string }
  | { success: true; data: { email: string } }
  | null;

async function submitSignUp(_prevState: FormState, formData: FormData): Promise<FormState> {
  // The country code and local number are two separate fields in the UI
  // (so a student never has to type "+212" themselves) but signUp()
  // only takes one phone string — join them here, at the boundary.
  const countryCode = String(formData.get("countryCode") ?? "");
  const customCode = String(formData.get("customCountryCode") ?? "").trim();
  const dialCode = countryCode === OTHER_PHONE_COUNTRY_VALUE ? customCode : countryCode;
  const localNumber = String(formData.get("phone") ?? "").trim();

  return signUp({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: `${dialCode} ${localNumber}`.trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitSignUp, null);
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_PHONE_COUNTRY_CODE);

  useEffect(() => {
    if (state?.success) {
      router.push(`/verify-email?email=${encodeURIComponent(state.data.email)}`);
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start practicing CSCA mock exams in a few minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" autoComplete="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <div className="flex gap-2">
              <select
                id="countryCode"
                name="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-9 w-36 shrink-0 rounded-md border border-input bg-background px-2 text-sm"
                aria-label="Country code"
              >
                {PHONE_COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.country}
                  </option>
                ))}
                <option value={OTHER_PHONE_COUNTRY_VALUE}>Other</option>
              </select>
              {countryCode === OTHER_PHONE_COUNTRY_VALUE && (
                <Input name="customCountryCode" placeholder="Code, e.g. +49" inputMode="tel" className="w-28 shrink-0" required />
              )}
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="6 12 34 56 78" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required />
            <p className="text-xs text-muted-foreground">
              At least 8 characters, with an uppercase letter, a lowercase letter, and a number.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          {state && !state.success && (
            <p className="text-sm text-destructive" role="alert">
              {state.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?&nbsp;
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
