import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Link href="/" className="flex flex-col items-center gap-1 text-center">
        <span className="text-lg font-semibold tracking-tight">CSCA Prep</span>
        <span className="text-xs text-muted-foreground">by Opportunities Hunter</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
