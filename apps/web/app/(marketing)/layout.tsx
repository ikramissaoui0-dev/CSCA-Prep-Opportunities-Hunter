import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth/session";
import { ROLE_HOME_ROUTE } from "@/lib/auth/roles";
import { signOut } from "@/app/(auth)/actions";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/exam-guide", label: "Exam guide" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Marketing pages are public (middleware.ts's PUBLIC_ROUTES), so a
  // logged-in student reaching one — e.g. clicking "Contact us" from the
  // gated exam picker — never loses their session. But the header used to
  // always show guest CTAs ("Sign in" / "Get started") regardless, which
  // made an already-signed-in visitor look and feel logged out even
  // though they weren't. Check the session here (non-redirecting) so the
  // header reflects reality either way.
  const user = await getCurrentUser();

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
            <ThemeToggle />
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROLE_HOME_ROUTE[user.role]}>Dashboard</Link>}
                />
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/login">Sign in</Link>} />
                <Button size="sm" nativeButton={false} render={<Link href="/register">Get started</Link>} />
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-brand-navy text-brand-navy-foreground">
        <div className="mx-auto max-w-6xl space-y-4 px-6 py-8 text-sm text-brand-navy-foreground/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-brand-navy-foreground">© {new Date().getFullYear()} CSCA Prep, by Opportunities Hunter.</p>
            <nav className="flex flex-wrap gap-4">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-brand-navy-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/15 pt-4">
            <a href="tel:+212621521861" className="hover:text-brand-navy-foreground">
              +212 6 21 52 18 61
            </a>
            <a href="tel:+212688051703" className="hover:text-brand-navy-foreground">
              +212 6 88 05 17 03
            </a>
            <a href="mailto:contact@csca.opportunitieshunter.com" className="hover:text-brand-navy-foreground">
              contact@csca.opportunitieshunter.com
            </a>
            <span>3rd floor, Imm Capital Office, 93 Boulevard Abdelmoumen, N° 74, Casablanca 20042</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
