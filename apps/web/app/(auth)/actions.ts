"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { clientEnv } from "@/lib/env";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { ROLE_HOME_ROUTE, type UserRole } from "@/lib/auth/roles";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type SignUpInput,
  type SignInInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validation/auth";

export async function signUp(input: SignUpInput): Promise<ActionResult<{ email: string }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }

  // Defense-in-depth alongside Supabase Auth's own signup throttling —
  // bounds mass account creation from a single source regardless of
  // whatever GoTrue's own limits happen to be.
  const ip = await getRequestIp();
  const rateLimit = await checkRateLimit("auth-signup", ip, { requests: 5, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many signups from this network. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }

  const { fullName, email, phone, password } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      // Read by the handle_new_user trigger (supabase/migrations) to seed profiles.full_name/phone.
      data: { full_name: fullName, phone },
    },
  });

  if (error) {
    logger.warn({ err: error.message }, "sign_up_failed");
    // Supabase's own message is safe to show (e.g. "User already registered").
    return actionFailure(new AppError("VALIDATION_ERROR", error.message));
  }

  return { success: true, data: { email } };
}

export async function signIn(input: SignInInput): Promise<ActionResult<null>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }

  // Brute-force protection, on top of whatever Supabase Auth already
  // does server-side — this bucket is per-IP, not per-email, so it
  // can't be used to enumerate whether a given email has an account.
  const ip = await getRequestIp();
  const rateLimit = await checkRateLimit("auth-signin", ip, { requests: 10, windowSeconds: 600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many sign-in attempts. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    logger.info({ email: parsed.data.email }, "sign_in_failed");
    return actionFailure(new AppError("UNAUTHENTICATED", "Invalid email or password"));
  }

  const { data: claimsData } = await supabase.auth.getClaims();
  const role = (claimsData?.claims.user_role as UserRole | undefined) ?? "student";

  // Deliberately outside any try/catch: redirect() throws a control-flow
  // signal internally (NEXT_REDIRECT) that a catch block would swallow.
  redirect(ROLE_HOME_ROUTE[role]);
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signInWithGoogle(): Promise<never> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error || !data.url) {
    logger.error({ err: error?.message }, "google_oauth_init_failed");
    redirect("/login?error=oauth_init_failed");
  }

  redirect(data.url);
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<ActionResult<null>> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }

  // Prevents this endpoint from being used to mail-bomb an arbitrary
  // inbox — each request sends a real email to whatever address is
  // given, whether or not it has an account.
  const ip = await getRequestIp();
  const rateLimit = await checkRateLimit("auth-forgot-password", ip, { requests: 5, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many requests. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }

  const supabase = await createClient();
  // Always return success regardless of whether the email exists —
  // enumerating registered emails via this endpoint is a real leak.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  return { success: true, data: null };
}

export async function updatePassword(input: ResetPasswordInput): Promise<ActionResult<null>> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return actionFailure(new AppError("VALIDATION_ERROR", error.message));
  }

  redirect("/login?reset=success");
}
