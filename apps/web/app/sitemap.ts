import type { MetadataRoute } from "next";
import { clientEnv } from "@/lib/env";
import { blogPosts } from "@/lib/blog/posts";

// exam-guide was missing entirely — the single most keyword-dense,
// differentiated page on the site (real CSCA subject/format/date data),
// so it gets the same priority as the homepage rather than the
// generic 0.7 every other static page gets.
const STATIC_ROUTES = ["/", "/exam-guide", "/about", "/how-it-works", "/pricing", "/faq", "/contact", "/blog"];
const HIGH_PRIORITY_ROUTES = new Set(["/", "/exam-guide"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: HIGH_PRIORITY_ROUTES.has(path) ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries];
}
