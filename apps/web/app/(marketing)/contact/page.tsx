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

      <div className="space-y-2 rounded-lg border bg-muted/30 p-4 text-sm">
        <p className="font-medium">CSCA Prep, by Opportunities Hunter</p>
        <p className="text-muted-foreground">
          Phone:{" "}
          <a href="tel:+212621521861" className="underline hover:text-foreground">
            +212 6 21 52 18 61
          </a>{" "}
          ·{" "}
          <a href="tel:+212688051703" className="underline hover:text-foreground">
            +212 6 88 05 17 03
          </a>
        </p>
        <p className="text-muted-foreground">
          Email:{" "}
          <a href="mailto:contact@opportunitieshunter.com" className="underline hover:text-foreground">
            contact@opportunitieshunter.com
          </a>
        </p>
        <p className="text-muted-foreground">3rd floor, Imm Capital Office, 93 Boulevard Abdelmoumen, N° 74, Casablanca 20042</p>
      </div>

      <ContactForm />
    </div>
  );
}
