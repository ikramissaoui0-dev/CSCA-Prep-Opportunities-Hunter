import { clientEnv } from "@/lib/env";

/**
 * BreadcrumbList structured data — Google can render this as the
 * breadcrumb trail under a search result instead of the raw URL,
 * which measurably improves click-through. Always starts from Home;
 * pass one {name, path} per level below it (a blog post is Home >
 * Blog > post, so two entries; most other pages are just one).
 */
export function breadcrumbJsonLd(...trail: { name: string; path: string }[]) {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      ...trail.map((step, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: step.name,
        item: `${base}${step.path}`,
      })),
    ],
  };
}
