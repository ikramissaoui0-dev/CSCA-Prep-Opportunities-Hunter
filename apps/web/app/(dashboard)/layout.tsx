import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { signOut } from "@/app/(auth)/actions";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  admin: "Admin",
  content_manager: "Content Manager",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  const studentNav = [
    { href: "/student", label: "Dashboard" },
    { href: "/exam#past-exam-papers", label: "Past exam papers" },
    { href: "/exam#practice-exercises", label: "Practice exercises" },
    { href: "/results", label: "Results" },
    { href: "/exam-guide", label: "Exam guide" },
    { href: "/student/leaderboard", label: "Leaderboard" },
    { href: "/student/billing", label: "Billing" },
  ];
  const staffNav =
    user.role === "content_manager"
      ? [{ href: "/admin/content", label: "Admin" }]
      : [
          { href: "/admin", label: "Admin" },
          { href: "/admin/access", label: "Free Access" },
        ];
  const navLinks = user.role === "content_manager" ? staffNav : [...studentNav, ...(user.role === "admin" ? staffNav : [])];

  return (
    <div className="min-h-svh">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3">
        <div className="flex items-center gap-6">
          <Brand />
          <nav className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <Badge variant="secondary">{ROLE_LABEL[user.role] ?? user.role}</Badge>
          <ThemeToggle />
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
