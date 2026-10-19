import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2">
      <Image src="/brand-icon.png" alt="CSCAprepa" width={32} height={32} className="h-8 w-8" priority />
      <Wordmark className="text-lg" />
    </Link>
  );
}
