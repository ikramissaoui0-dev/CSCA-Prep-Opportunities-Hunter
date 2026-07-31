import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clientEnv } from "@/lib/env";
import { ROLE_HOME_ROUTE, roleCanAccess, type UserRole } from "@/lib/auth/roles";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  // Phase 12 — public marketing site (apps/web/app/(marketing)).
  "/about",
  "/how-it-works",
  "/pricing",
  "/faq",
  "/contact",
  "/blog",
  "/sitemap.xml",
  "/robots.txt",
];
const AUTH_CALLBACK_PREFIX = "/auth/callback";
const PUBLIC_PREFIXES = ["/blog/"]; // blog post detail pages, e.g. /blog/what-is-the-csca

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    pathname.startsWith(AUTH_CALLBACK_PREFIX) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  );
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
    if (isPublicRoute(pathname)) {
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
