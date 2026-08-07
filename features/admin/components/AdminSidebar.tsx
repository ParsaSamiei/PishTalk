"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Newspaper,
  Images,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Settings,
  Users,
  UserCircle,
  MessageSquare,
  HandHeart,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

/**
 * Order matches docs/07_ADMIN_PANEL.md's Sidebar Navigation spec exactly:
 * Dashboard, Events, Registrations, Blogs, Resources, Gallery, FAQ, Rules,
 * Site Settings, Profile. (Logout is rendered separately in AdminTopbar.)
 *
 * "پیام‌ها" (Messages) is an addition beyond that spec — same rationale as
 * the ContactMessage model itself (see prisma/schema.prisma): the docs never
 * defined a place to read contact-form submissions, so this closes that gap.
 * Placed right after Registrations since both are visitor-submitted data.
 *
 * "حامیان" (Sponsors) is likewise an addition: docs/00_AI_INSTRUCTIONS.md
 * lists Sponsors under "Future Expansion", not the current Sidebar spec.
 * Placed next to Rules since both are simple published-list content pages
 * that feed a single public page (/support, /rules).
 */
export const ADMIN_NAV = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "رویدادها", href: "/admin/events", icon: CalendarDays },
  { label: "ثبت‌نام‌ها", href: "/admin/registrations", icon: Users },
  { label: "پیام‌ها", href: "/admin/messages", icon: MessageSquare },
  { label: "وبلاگ", href: "/admin/blog", icon: Newspaper },
  { label: "منابع", href: "/admin/resources", icon: BookOpen },
  { label: "گالری", href: "/admin/gallery", icon: Images },
  { label: "سوالات متداول", href: "/admin/faq", icon: HelpCircle },
  { label: "قوانین", href: "/admin/rules", icon: ShieldCheck },
  { label: "حامیان", href: "/admin/sponsors", icon: HandHeart },
  { label: "تنظیمات سایت", href: "/admin/settings", icon: Settings },
  { label: "پروفایل", href: "/admin/profile", icon: UserCircle },
] as const;

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-e border-border bg-surface p-6 lg:flex">
      <Logo />
      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary",
                isActive && "bg-surface-secondary text-text-primary",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { AdminSidebar };
