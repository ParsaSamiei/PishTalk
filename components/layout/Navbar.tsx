"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NavLinks } from "@/components/navigation/NavLinks";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Sticky primary navigation. Per docs/04_DESIGN_SYSTEM.md ("Sticky",
 * "Transparent on Hero", "Solid after scrolling"): on the homepage the bar
 * starts transparent over the dark Hero and becomes solid once the user
 * scrolls past it. Every other page has no dark Hero, so it's solid
 * immediately.
 */
function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!isHomepage) return;

    function handleScroll() {
      setScrolled(window.scrollY > 64);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  // On any page other than the homepage there's no dark Hero to sit over,
  // so the bar is solid regardless of `scrolled` (which only tracks scroll
  // position on the homepage).
  const isTransparent = isHomepage && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        isTransparent
          ? "border-transparent bg-transparent"
          : "border-border bg-surface/80 backdrop-blur-md"
      )}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Logo variant={isTransparent ? "light" : "dark"} />
        <NavLinks
          className={cn("hidden lg:flex", isTransparent && "[&_a]:text-white/80 [&_a]:hover:text-white")}
        />
        <div className="flex items-center gap-2">
          <span className={cn(isTransparent && "[&_button]:text-white [&_button:hover]:bg-white/10")}>
            <ThemeToggle />
          </span>
          <Button
            asChild
            size="md"
            variant={isTransparent ? "accent" : "primary"}
            className="hidden sm:inline-flex"
          >
            <Link href="/events">ثبت نام رویداد</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

export { Navbar };
