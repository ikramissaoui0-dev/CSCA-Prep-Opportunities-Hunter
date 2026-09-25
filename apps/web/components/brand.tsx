import Image from "next/image";
import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <Image src="/logo.png" alt="Opportunities Hunter" width={32} height={32} className="h-8 w-8" priority />
      <span className="flex flex-col leading-none">
        <span className="font-semibold tracking-tight">CSCA Prep</span>
        <span className="text-[11px] text-muted-foreground">by Opportunities Hunter</span>
      </span>
    </Link>
  );
}
