import Link from "next/link";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin", "content_manager");

  const sharedNav = [
    { href: "/admin/content", label: "Questions" },
    { href: "/admin/exams", label: "Exams" },
    { href: "/admin/courses", label: "Courses" },
  ];
  // Users, payments, and subscriptions all expose data content_manager
  // has no RLS access to (profiles_admin_read_all, payments_staff_read,
  // subscriptions_staff_read are admin-only) — hiding these links for
  // content_manager isn't just tidiness, it matches what they can
  // actually load.
  const adminOnlyNav =
    user.role === "admin"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/users", label: "Users" },
          { href: "/admin/access", label: "Free Access" },
          { href: "/admin/payments", label: "Payments" },
          { href: "/admin/subscriptions", label: "Subscriptions" },
        ]
      : [];
  const navLinks = [...adminOnlyNav, ...sharedNav];

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-1 border-b pb-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
