import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — CSCA Prep",
  description: "Get in touch with the CSCA Prep team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-3 text-muted-foreground">Questions about CSCA Prep, billing, or your account? Send us a message.</p>
      </div>
      <ContactForm />
    </div>
  );
}
