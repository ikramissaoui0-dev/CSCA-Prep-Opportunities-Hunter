import "server-only";

import { Resend } from "resend";
import { serverEnv, clientEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";

let cachedClient: Resend | undefined;

// Same lazy-singleton, throws-only-when-used shape as lib/ai/client.ts
// and lib/stripe/client.ts — a dev environment with no Resend account
// yet shouldn't crash the whole app at boot.
function getResendClient(): Resend {
  if (!serverEnv.RESEND_API_KEY) {
    throw new AppError("PROVIDER_ERROR", "The contact form isn't configured on this server yet.");
  }
  if (!cachedClient) {
    cachedClient = new Resend(serverEnv.RESEND_API_KEY);
  }
  return cachedClient;
}

// Resend requires sending "from" a domain verified in its dashboard —
// derived from the site's own domain rather than hardcoded, but this
// address still won't deliver until that domain is actually verified in
// Resend (Dashboard > Domains). Until then, getResendClient's caller
// gets Resend's own API error, not a silent failure.
function getFromAddress(): string {
  const host = new URL(clientEnv.NEXT_PUBLIC_SITE_URL).hostname;
  return `CSCA Prep <contact@${host}>`;
}

export async function sendContactFormEmail(input: { name: string; email: string; message: string }): Promise<void> {
  if (!serverEnv.CONTACT_FORM_RECIPIENT_EMAIL) {
    throw new AppError("PROVIDER_ERROR", "The contact form isn't configured on this server yet.");
  }

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: serverEnv.CONTACT_FORM_RECIPIENT_EMAIL,
    replyTo: input.email,
    subject: `Contact form: ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });

  if (error) {
    throw new AppError("PROVIDER_ERROR", undefined, { cause: error });
  }
}
