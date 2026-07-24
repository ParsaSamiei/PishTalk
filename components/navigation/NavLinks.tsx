"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  readonly className?: string;
  readonly onNavigate?: () => void;
}

function NavLinks({ className, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {MAIN_NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "block rounded-[var(--radius-button)] px-3 py-2 text-[15px] font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary",
                isActive && "text-text-primary"
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { NavLinks };
