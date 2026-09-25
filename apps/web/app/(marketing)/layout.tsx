import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/exam-guide", label: "Exam guide" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Brand />
          <nav className="flex flex-wrap items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/login">Sign in</Link>} />
            <Button size="sm" nativeButton={false} render={<Link href="/register">Get started</Link>} />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CSCA Prep, by Opportunities Hunter.</p>
          <nav className="flex flex-wrap gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
