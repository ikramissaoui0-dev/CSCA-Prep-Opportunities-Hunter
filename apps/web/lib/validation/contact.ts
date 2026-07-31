import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  // Honeypot — real users never fill this in; a bot's generic form-filler usually does.
  website: z.string().max(0, "").optional(),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;
