"use server";

import { eq } from "drizzle-orm";
import { studentAccessGrants } from "@csca/db";
import { requireUser } from "@/lib/auth/session";
import { withRlsContext } from "@/lib/db";

/**
 * Marks the one-time "your access has been activated" banner as shown.
 * Column-scoped RLS grant (student_access_grants_owner_update +
 * activation_message_shown-only column grant, 0012_student_access_grants.sql)
 * means this can't touch tier/expiry/revocation even if the client sent
 * a different grantId — the WHERE clause is redundant with RLS's own
 * user_id check, kept for clarity.
 */
export async function dismissActivationBanner(grantId: string): Promise<void> {
  const user = await requireUser();
  await withRlsContext(user.id, user.role, (tx) =>
    tx.update(studentAccessGrants).set({ activationMessageShown: true }).where(eq(studentAccessGrants.id, grantId)),
  );
}
