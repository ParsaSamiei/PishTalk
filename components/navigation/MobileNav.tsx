"use client";

import * as React from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/shared/Logo";
import { NavLinks } from "@/components/navigation/NavLinks";
import { cn } from "@/lib/utils";

/**
 * Slide-out drawer navigation for mobile, per
 * docs/03_Information_Architecture.md ("On mobile it becomes a slide-out drawer").
 */
function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu aria-hidden="true" />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 start-0 z-50 flex h-full w-[85%] max-w-sm flex-col gap-8 bg-surface p-6 shadow-lg outline-none"
          )}
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title asChild>
              <Logo />
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="بستن منو">
                <X aria-hidden="true" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <NavLinks className="flex-col items-stretch gap-1" onNavigate={() => setOpen(false)} />
          <Button asChild size="lg" className="mt-auto">
            <Link href="/events" onClick={() => setOpen(false)}>
              ثبت نام رویداد
            </Link>
          </Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { MobileNav };
