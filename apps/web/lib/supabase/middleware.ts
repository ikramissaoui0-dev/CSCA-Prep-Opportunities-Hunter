import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clientEnv } from "@/lib/env";
import { ROLE_HOME_ROUTE, roleCanAccess, type UserRole } from "@/lib/auth/roles";

// Only these areas require a session (they all live in app/(dashboard),
// whose layout also calls requireUser() as a second line of defense).
// Everything else — marketing pages, auth pages, /api/* (which authorize
// themselves, e.g. the CRON_SECRET check), and unknown URLs — passes
// through. Unknown URLs used to be redirected to /login (a 307), which
// made every dead link a "soft 404" for search engines instead of a real
// 404 from app/not-found.tsx.
const PROTECTED_PREFIXES = ["/student", "/admin", "/exam", "/results"];

// Segment-aware, not a bare startsWith — "/exam" must not capture the
// public "/exam-guide".
function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Refreshes the Supabase session on every request and gates protected
 * routes by role. This must run in middleware — Server Components can't
 * write cookies, so without this, sessions silently expire on the client
 * while the server keeps rendering against a stale token.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // IMPORTANT: getClaims() must be called before any other logic. It both
  // verifies the JWT and triggers a token refresh (writing new cookies via
  // setAll above) if the access token is close to expiry.
  const { data, error } = await supabase.auth.getClaims();
  const claims = error ? null : data?.claims;

  const { pathname } = request.nextUrl;

  if (!claims) {
    if (!isProtectedRoute(pathname)) {
      return response;
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (claims.user_role as UserRole | undefined) ?? "student";

  if (!roleCanAccess(role, pathname)) {
    return NextResponse.redirect(new URL(ROLE_HOME_ROUTE[role], request.url));
  }

  return response;
}
