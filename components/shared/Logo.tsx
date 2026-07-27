import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface LogoProps {
  readonly className?: string;
  readonly variant?: "light" | "dark";
}

/**
 * Wordmark used in the navbar, footer, and loading screen.
 */
function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-xl font-bold", className)}
      aria-label="پیشتاک - صفحه اصلی"
    >
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-xl"
        priority
      />

      <span className="flex items-center">
        <span className="font-bold">
          <span className="text-yellow-400">پیش</span>
          <span
            className={variant === "light" ? "text-white" : "text-text-primary"}
          >
            تاک
          </span>
        </span>
      </span>
    </Link>
  );
}

export { Logo };
