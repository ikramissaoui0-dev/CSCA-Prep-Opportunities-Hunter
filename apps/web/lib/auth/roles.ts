export { USER_ROLES, type UserRole } from "@csca/types";
import type { UserRole } from "@csca/types";

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  student: "/student",
  admin: "/admin",
  content_manager: "/admin/content",
};

/**
 * Route-prefix -> roles allowed. First match wins; anything not listed
 * here is reachable by any authenticated role (see PUBLIC_ROUTES in
 * lib/supabase/middleware.ts for unauthenticated access).
 *
 * This is the coarse, fast check that runs in middleware. It is a UX
 * convenience (redirect before a page even renders), not the security
 * boundary — RLS policies in Postgres are the boundary (see docs/schema.sql).
 */
const ROLE_ROUTE_RULES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["admin", "content_manager"] },
  { prefix: "/student", roles: ["student", "admin"] },
];

export function roleCanAccess(role: UserRole, pathname: string): boolean {
  const rule = ROLE_ROUTE_RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return true;
  return rule.roles.includes(role);
}
