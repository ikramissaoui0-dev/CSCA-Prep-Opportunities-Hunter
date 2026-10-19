import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wordmark } from "@/components/wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="flex flex-col items-center gap-1 text-center">
        <Image src="/brand-icon.png" alt="CSCAprepa" width={48} height={48} className="mb-1 h-12 w-12" priority />
        <Wordmark className="text-xl" />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
