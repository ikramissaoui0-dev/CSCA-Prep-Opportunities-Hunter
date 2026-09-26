import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog/posts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog — CSCA Prep",
  description: "Guides and tips for preparing for the CSCA exam, from mock-exam strategy to how our explanations work.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-3 text-muted-foreground">Guides and tips for preparing for the CSCA.</p>
      </div>

      <div className="space-y-4">
        {sorted.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardDescription>
                  {new Date(post.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} · {post.author}
                </CardDescription>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
