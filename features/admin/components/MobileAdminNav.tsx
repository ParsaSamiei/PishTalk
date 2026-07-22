"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/shared/Logo";
import { ADMIN_NAV } from "@/features/admin/components/AdminSidebar";
import { cn } from "@/lib/utils";

function MobileAdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو">
          <Menu aria-hidden="true" />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed inset-y-0 start-0 z-50 flex h-full w-72 flex-col gap-6 bg-surface p-6 shadow-lg outline-none">
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
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
              const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
                    isActive && "bg-surface-secondary text-text-primary"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { MobileAdminNav };
