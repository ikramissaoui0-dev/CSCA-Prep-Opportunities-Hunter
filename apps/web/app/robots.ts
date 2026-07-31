import type { MetadataRoute } from "next";
import { clientEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything behind auth is either private (dashboard data) or
      // pointless to index (login/register forms) — no SEO value, and
      // some of it (exam content) shouldn't be crawlable at all.
      disallow: ["/student", "/exam", "/results", "/admin", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/auth", "/api"],
    },
    sitemap: `${clientEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
