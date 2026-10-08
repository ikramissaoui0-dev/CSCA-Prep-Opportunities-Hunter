import Image from "next/image";
import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <Image src="/logo.png" alt="CSCA Prep" width={32} height={32} className="h-8 w-8" priority />
      <span className="font-semibold tracking-tight">CSCA Prep</span>
    </Link>
  );
}
