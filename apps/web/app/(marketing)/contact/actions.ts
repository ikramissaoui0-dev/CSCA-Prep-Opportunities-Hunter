"use server";

import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { sendContactFormEmail } from "@/lib/email/contact";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation/contact";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

// Anonymous + no login required, so IP is the only identifier available
// — 3 per 10 minutes is generous for a real visitor (who sends one) and
// a real constraint on a scripted spammer working around the honeypot.
const CONTACT_FORM_RATE_LIMIT = { requests: 3, windowSeconds: 600 };

export async function submitContactForm(input: ContactFormInput): Promise<ActionResult<null>> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return actionFailure(new AppError("VALIDATION_ERROR", parsed.error.issues[0]?.message));
  }

  // Honeypot: a real visitor never fills this field in — silently
  // pretend success rather than telling a bot its submission was
  // detected (that would just teach it to try harder).
  if (parsed.data.website) {
    return { success: true, data: null };
  }

  const ip = await getRequestIp();
  const rateLimit = await checkRateLimit("contact-form", ip, CONTACT_FORM_RATE_LIMIT);
  if (!rateLimit.allowed) {
    return actionFailure(new AppError("RATE_LIMITED", `Too many messages sent. Try again in ${rateLimit.retryAfterSeconds}s.`));
  }

  try {
    await sendContactFormEmail(parsed.data);
    return { success: true, data: null };
  } catch (error) {
    return actionFailure(error);
  }
}
