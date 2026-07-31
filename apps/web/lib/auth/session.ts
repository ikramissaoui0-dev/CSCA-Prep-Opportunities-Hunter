import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME_ROUTE, type UserRole } from "@/lib/auth/roles";
import { logger } from "@/lib/logger";

export type SessionUser = {
  id: string;
  email: string | undefined;
  role: UserRole;
};

/**
 * Reads and verifies the current user from the JWT (local verification via
 * getClaims() where possible — no network round trip on the common path).
 * Returns null when there is no valid session; never throws for that case.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  const { claims } = data;
  return {
    id: claims.sub,
    email: claims.email,
    role: (claims.user_role as UserRole | undefined) ?? "student",
  };
}

/**
 * For Server Components/Actions that require *some* authenticated user.
 * Redirects to /login rather than throwing — middleware should normally
 * catch this first, so reaching here usually means direct navigation to a
 * cached page after sign-out.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * For Server Components/Actions that require one of a specific set of
 * roles. Logs the denial (useful for spotting privilege-escalation
 * attempts) before redirecting the user back to their own home route.
 */
export async function requireRole(...allowed: UserRole[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) {
    logger.warn(
      { userId: user.id, role: user.role, allowed },
      "role_check_denied",
    );
    redirect(ROLE_HOME_ROUTE[user.role]);
  }
  return user;
}
