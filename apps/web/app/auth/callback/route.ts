import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

/**
 * Single callback for every Supabase Auth redirect flow — email
 * verification, Google OAuth, and password recovery all land here with a
 * PKCE `code` param (flowType defaults to "pkce" for @supabase/ssr).
 * `next` lets a specific flow (e.g. password recovery) choose where to
 * go after the code is exchanged for a session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    logger.warn({ err: error.message }, "auth_callback_exchange_failed");
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
