import "server-only";

import { Resend } from "resend";
import { serverEnv } from "@/lib/env";
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

// Sends from the csca.opportunitieshunter.com subdomain — the domain
// verified in Resend for this app — matching the contact@csca.
// opportunitieshunter.com address shown everywhere on the site.
function getFromAddress(): string {
  return "CSCA Prep <contact@csca.opportunitieshunter.com>";
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
