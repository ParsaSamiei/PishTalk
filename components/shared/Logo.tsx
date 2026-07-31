"use client";

import Link from "next/link";
import Image from "next/image";

import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface LogoProps {
  readonly className?: string;
  readonly variant?: "light" | "dark";
}

/**
 * Wordmark used in the navbar, footer, and loading screen.
 *
 * A Client Component because Navbar and MobileNav (both client) render it.
 *
 * The name is split into two halves so the first can carry the accent colour
 * ("پیش|تاک" / "Pish|talk"); both halves come from the dictionary.
 */
function Logo({ className, variant = "dark" }: LogoProps) {
  const d = useDictionary();

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-xl font-bold", className)}
      aria-label={d.logo.label}
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
          <span className="text-yellow-400">{d.logo.first}</span>
          <span
            className={variant === "light" ? "text-white" : "text-text-primary"}
          >
            {d.logo.second}
          </span>
        </span>
      </span>
    </Link>
  );
}

export { Logo };
