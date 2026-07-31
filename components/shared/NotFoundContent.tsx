"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Home,
  Mail,
  Compass,
  Search,
  CalendarDays,
  Newspaper,
  BookOpen,
  Images,
  FileText,
  HelpCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { GlowOrb } from "@/components/illustrations/GlowOrb";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { FloatingIcon } from "@/components/illustrations/FloatingIcon";
import { RobotMascot } from "@/components/illustrations/RobotMascot";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";

// Icons for the "helpful navigation" grid, keyed to lib/navigation.ts so
// the links themselves stay single-sourced there; "/" is dropped since
// it's already the primary CTA below.
const QUICK_LINK_ICONS: Record<string, LucideIcon> = {
  "/events": CalendarDays,
  "/blog": Newspaper,
  "/resources": BookOpen,
  "/gallery": Images,
  "/rules": FileText,
  "/faq": HelpCircle,
  "/about": Users,
  "/contact": Mail,
};

const quickLinks = MAIN_NAV_ITEMS.filter((item) => item.href !== "/");

/**
 * Shared 404 body, per docs/03_Information_Architecture.md ("Friendly
 * illustration", "Helpful links", "Return Home") and docs/08_SEO.md
 * ("Helpful Navigation", "Return Home"). Reused by:
 *  - app/not-found.tsx — the boundary Next actually renders for a URL
 *    that matches no route at all, so it brings its own Navbar/Footer.
 *  - app/(marketing)/not-found.tsx — an in-app notFound() call (e.g. an
 *    unknown blog/event/gallery slug), already wrapped by MarketingLayout.
 *
 * Mirrors HeroSection's visual language (circuit backdrop, glow orbs,
 * staggered entrance, the same RobotMascot that used to headline the
 * Hero before CoffeeMugScene took over) so a wrong turn still feels like
 * part of the site instead of a dead end.
 */
function NotFoundContent() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-surface text-text-primary dark:bg-primary dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(244,185,66,0.18),transparent_70%)]"
      />
      <CircuitBackground
        id="not-found"
        className="text-primary/5 dark:text-white/6"
      />
      <GlowOrb className="top-[-14%] start-[-10%] size-96 bg-accent/20 dark:bg-accent/25" />
      <GlowOrb
        className="bottom-[-18%] end-[-12%] size-112 bg-sky-400/15 dark:bg-sky-400/10"
        style={{ animationDelay: "-3s" }}
      />

      <FloatingIcon
        icon={Search}
        className="hidden border-primary/10 bg-surface-secondary text-accent-hover dark:border-white/15 dark:bg-white/5 dark:text-accent sm:flex top-[18%] start-[8%]"
        style={{ animationDelay: "0s" }}
      />
      <FloatingIcon
        icon={Compass}
        size="sm"
        className="hidden border-primary/10 bg-surface-secondary text-text-secondary dark:border-white/10 dark:bg-white/5 dark:text-white/70 lg:flex bottom-[16%] end-[10%]"
        style={{ animationDelay: "-2.4s" }}
      />

      <Container className="relative grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-start"
        >
          <motion.span
            variants={itemVariants}
            aria-hidden="true"
            className="font-mono text-7xl font-bold tracking-tight text-gradient-accent drop-shadow-[0_1px_2px_rgba(245,158,11,0.35)] dark:drop-shadow-[0_0_8px_rgba(250,204,21,0.4)] sm:text-8xl"
          >
            404
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="max-w-lg text-2xl font-bold leading-tight sm:text-3xl"
          >
            این صفحه پیدا نشد
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-md text-text-secondary"
          >
            ممکن است لینک اشتباه باشد یا این صفحه جابه‌جا یا حذف شده باشد. نگران
            نباشید؛ از این‌جا می‌توانید مسیر درست را پیدا کنید.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild variant="accent" size="lg">
              <Link href="/">
                <Home className="size-4" aria-hidden="true" />
                بازگشت به صفحه اصلی
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                <Mail className="size-4" aria-hidden="true" />
                گزارش لینک خراب
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 pt-2 lg:justify-start"
          >
            {quickLinks.map((item) => {
              const Icon = QUICK_LINK_ICONS[item.href] ?? Compass;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-text-primary dark:border-white/15 dark:bg-white/5 dark:text-white/70 dark:hover:text-white"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.8,
            delay: shouldReduceMotion ? 0 : 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto w-full max-w-55 sm:max-w-xs lg:mx-0 lg:max-w-sm"
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.9,
            }}
            className="absolute -top-2 end-2 z-10 rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary shadow-md dark:border-white/15 dark:bg-white/10 dark:text-white/80 sm:-top-4 sm:end-6"
          >
            این‌جا رو نمی‌شناسم!
          </motion.div>
          <RobotMascot className="w-full" />
        </motion.div>
      </Container>
    </section>
  );
}

export { NotFoundContent };
