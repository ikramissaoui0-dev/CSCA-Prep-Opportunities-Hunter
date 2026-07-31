import "server-only";

import { eq, and, isNull } from "drizzle-orm";
import { studentAccessGrants, type PlanTier } from "@csca/db";
import type { UserRole } from "@csca/types";
import { withRlsContext } from "@/lib/db";

export type PendingActivationGrant = { id: string; grantedTier: PlanTier };

/**
 * The one thing the student dashboard needs to decide whether to show
 * "Your CSCA Prep access has been activated" — a grant now linked to
 * this user (the handle_new_user trigger did that at signup) that
 * hasn't shown its one-time message yet. Revoked/expired grants are
 * deliberately excluded: there's nothing to celebrate about access that
 * never became — or no longer is — real.
 */
export async function getPendingActivationGrant(userId: string, role: UserRole): Promise<PendingActivationGrant | null> {
  return withRlsContext(userId, role, async (tx) => {
    const [row] = await tx
      .select({ id: studentAccessGrants.id, grantedTier: studentAccessGrants.grantedTier })
      .from(studentAccessGrants)
      .where(
        and(
          eq(studentAccessGrants.userId, userId),
          eq(studentAccessGrants.activationMessageShown, false),
          isNull(studentAccessGrants.revokedAt),
        ),
      );
    return row ?? null;
  });
}
