import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { clientEnv } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "CSCA Prep";
const SITE_DESCRIPTION =
  "CSCA Prep by Opportunities Hunter — realistic mock exams, adaptive practice, and personalized explanations for the CSCA (Chinese University entrance exam for international students).";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${SITE_NAME} — CSCA Exam Prep by Opportunities Hunter`,
    // Every page's own title already includes "— CSCA Prep" by
    // convention (see e.g. app/(auth)/login/page.tsx) — a template
    // suffix here would double it up, so this stays a no-op template.
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  keywords: ["CSCA", "CSCA exam", "CSCA prep", "study in China", "Chinese university entrance exam", "Opportunities Hunter"],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — CSCA Exam Prep by Opportunities Hunter`,
    description: SITE_DESCRIPTION,
    // logo.png is square (1080x1080), not the usual 1200x630 OG banner
    // shape — still valid, platforms just center/crop it rather than
    // filling the whole card.
    images: [{ url: "/logo.png", width: 1080, height: 1080, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — CSCA Exam Prep by Opportunities Hunter`,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  verification: {
    google: "o4NhNqr8Gw1Q-_Lv2C6Ed3cnN7EFoqr-RGpBChixECQ",
  },
};

// Organization structured data (Phase 12 SEO) — site-wide since every
// page is part of the same organization; page-specific structured data
// (FAQPage, BlogPosting, ...) is added on top of this by the pages that
// need it, not instead of it.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  brand: { "@type": "Brand", name: "Opportunities Hunter" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {/* Both are no-ops anywhere but a Vercel deployment — no DSN or
            config needed, they detect the Vercel runtime themselves. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
