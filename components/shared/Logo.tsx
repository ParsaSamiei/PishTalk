import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  readonly className?: string;
  readonly variant?: "light" | "dark";
}

/**
 * Wordmark used in the navbar, footer, and loading screen.
 * Replace the inline mark with the final SVG asset when it is ready;
 * the accent dot preserves brand recognition in the meantime.
 */
function Logo({ className, variant = "dark" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-xl font-bold",
        variant === "light" ? "text-white" : "text-text-primary",
        className
      )}
      aria-label="پیشتاک - صفحه اصلی"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary">
        پ
      </span>
      <span>پیشتاک</span>
    </Link>
  );
}

export { Logo };
