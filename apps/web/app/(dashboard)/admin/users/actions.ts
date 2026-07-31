"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { updateUserRoleCore } from "@/lib/admin/users-actions-core";
import { updateUserRoleSchema, type UpdateUserRoleInput } from "@/lib/validation/user-admin";

export async function updateUserRole(input: UpdateUserRoleInput): Promise<ActionResult<null>> {
  const parsed = updateUserRoleSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const user = await requireRole("admin");
  const result = await updateUserRoleCore(user, parsed.data);
  if (result.success) revalidatePath("/admin/users");
  return result;
}
