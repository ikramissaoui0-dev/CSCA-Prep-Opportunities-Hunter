import "server-only";

import { clientEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { getResendClient, getFromAddress, isEmailConfigured } from "./resend-client";

export { isEmailConfigured };

const TIER_LABEL: Record<string, string> = { premium: "Premium", premium_plus: "Premium+" };

/**
 * Optional (spec section 14) — only meaningful for a PENDING_REGISTRATION
 * grant (no account yet), pointing them at the normal /register flow.
 * Reuses the Resend account already configured for the contact form
 * (lib/email/contact.ts) rather than adding a second provider.
 */
export async function sendAccessInvitationEmail(input: { email: string; grantedTier: string }): Promise<void> {
  if (!isEmailConfigured()) {
    throw new AppError("PROVIDER_ERROR", "Transactional email isn't configured on this server yet.");
  }

  const resend = getResendClient();
  const registerUrl = `${clientEnv.NEXT_PUBLIC_SITE_URL}/register`;
  const tierLabel = TIER_LABEL[input.grantedTier] ?? input.grantedTier;

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: input.email,
    subject: "Your CSCAprepa access is ready",
    text: [
      "Hi,",
      "",
      `You've been granted ${tierLabel} access to CSCAprepa — no payment needed.`,
      "",
      `Create your account with this exact email address to activate it: ${registerUrl}`,
      "",
      "See you there,",
      "The CSCAprepa team",
    ].join("\n"),
  });

  if (error) {
    throw new AppError("PROVIDER_ERROR", undefined, { cause: error });
  }
}
