import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/env";

/**
 * Server-side Supabase client for Server Components, Server Actions, and
 * Route Handlers. Create a fresh instance per request — never cache/share
 * this across requests.
 *
 * Cookie writes here are best-effort: a Server Component can't set cookies
 * on the response, so a token refresh triggered from one will be silently
 * dropped. `middleware.ts` is what actually keeps sessions alive — see the
 * comment there.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — no-op, middleware refreshes instead.
          }
        },
      },
    },
  );
}

/**
 * Elevated client that bypasses Row Level Security. Only use for trusted,
 * server-only operations that must act across users (webhooks, admin
 * batch jobs, the custom-claims hook's own migrations). Never expose this
 * client, or data fetched with it, directly to a request driven by
 * untrusted user input without an explicit authorization check first.
 */
export function createServiceRoleClient() {
  return createSupabaseClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
