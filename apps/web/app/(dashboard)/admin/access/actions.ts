"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import {
  grantFreeAccessCore,
  updateAccessGrantCore,
  revokeAccessGrantCore,
} from "@/lib/admin/access-grants-actions-core";
import { parseAccessGrantImportFile, commitAccessGrantImportCore, type AccessGrantImportPreviewRow } from "@/lib/admin/access-grant-import";
import {
  grantAccessSchema,
  accessGrantImportRowSchema,
  grantedTierSchema,
  expirationOptionSchema,
  type GrantAccessInput,
  type AccessGrantImportRow,
} from "@/lib/validation/access-grants";
import { z } from "zod";

export async function grantAccess(input: GrantAccessInput): Promise<ActionResult<{ grantId: string; wasExisting: boolean }>> {
  const parsed = grantAccessSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const admin = await requireRole("admin");
  const result = await grantFreeAccessCore(admin, parsed.data);
  if (result.success) revalidatePath("/admin/access");
  return result;
}

const updateAccessGrantInputSchema = z.object({
  grantId: z.string().uuid(),
  grantedTier: grantedTierSchema.optional(),
  expirationOption: expirationOptionSchema.optional(),
  customExpiresAt: z.string().datetime().optional(),
  adminNote: z.string().trim().max(2000).optional(),
});

export async function updateAccessGrant(input: z.infer<typeof updateAccessGrantInputSchema>): Promise<ActionResult<null>> {
  const parsed = updateAccessGrantInputSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }
  const admin = await requireRole("admin");
  const result = await updateAccessGrantCore(admin, parsed.data);
  if (result.success) revalidatePath("/admin/access");
  return result;
}

export async function revokeAccessGrant(grantId: string): Promise<ActionResult<null>> {
  const parsed = z.string().uuid().safeParse(grantId);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR"));
  }
  const admin = await requireRole("admin");
  const result = await revokeAccessGrantCore(admin, parsed.data);
  if (result.success) revalidatePath("/admin/access");
  return result;
}

const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;

export async function previewAccessGrantImport(formData: FormData): Promise<ActionResult<AccessGrantImportPreviewRow[]>> {
  await requireRole("admin");

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Choose a .csv or .xlsx file"));
  }
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    return actionFailure(new AppError("VALIDATION_ERROR", "File is too large (max 5MB)"));
  }
  if (!file.name.toLowerCase().endsWith(".csv") && !file.name.toLowerCase().endsWith(".xlsx")) {
    return actionFailure(new AppError("VALIDATION_ERROR", "Only .csv or .xlsx files are supported"));
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const results = await parseAccessGrantImportFile({ name: file.name, buffer });
  return { success: true, data: results };
}

const commitImportInputSchema = z.object({
  rows: z.array(accessGrantImportRowSchema),
  defaultGrantedTier: grantedTierSchema,
  defaultExpirationOption: expirationOptionSchema,
});

export async function commitAccessGrantImport(
  input: z.infer<typeof commitImportInputSchema>,
): Promise<ActionResult<{ created: number; updated: number; duplicatesSkipped: number; errors: number }>> {
  // Re-validate server-side — never trust a client round-trip of "rows I
  // was previously told were valid" (same posture as the question bank's
  // commitBulkImport).
  const parsed = commitImportInputSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", "One or more rows failed validation on re-check."));
  }

  const admin = await requireRole("admin");
  const validatedRows: AccessGrantImportRow[] = [];
  for (const row of parsed.data.rows) {
    const rowParsed = accessGrantImportRowSchema.safeParse(row);
    if (!rowParsed.success) {
      return actionFailure(new AppError("VALIDATION_ERROR", "One or more rows failed validation on re-check."));
    }
    validatedRows.push(rowParsed.data);
  }

  const result = await commitAccessGrantImportCore(admin, validatedRows, parsed.data.defaultGrantedTier, parsed.data.defaultExpirationOption);
  if (result.success) revalidatePath("/admin/access");
  return result;
}
