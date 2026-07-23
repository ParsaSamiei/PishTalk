"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowLeft, Bot, ChevronDown, Cpu, CircuitBoard, Orbit, Radar } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/shared/Countdown";
import { GlowOrb } from "@/components/illustrations/GlowOrb";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { FloatingIcon } from "@/components/illustrations/FloatingIcon";
import { RobotMascot } from "@/components/illustrations/RobotMascot";
import type { EventDetail } from "@/features/events/types/event";
import { formatEventDate } from "@/utils/formatDate";

interface HeroSectionProps {
  readonly nextEvent: EventDetail | null;
}

/**
 * Homepage Hero: communicates what Pishtalk is within the first few
 * seconds (docs/01_PRODUCT.md), built around a floating robot mascot, an
 * ambient circuit backdrop and a staggered entrance. The Hero follows the
 * site's own light/dark theme (light surface + dark text in light mode,
 * navy + white text in dark mode) exactly like every other section, so the
 * Navbar sitting on top of it can keep using its normal theme-token colors
 * in both modes.
 */
function HeroSection({ nextEvent }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 });
  const robotX = useTransform(springX, [-1, 1], [-16, 16]);
  const robotY = useTransform(springY, [-1, 1], [-12, 12]);

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-surface text-text-primary dark:bg-primary dark:text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(244,185,66,0.18),transparent_70%)]"
      />
      <CircuitBackground id="hero" className="text-primary/[0.05] dark:text-white/[0.06]" />
      <GlowOrb
        className="top-[-14%] start-[-10%] size-[26rem] bg-accent/20 dark:bg-accent/25"
        style={{ animationDelay: "0s" }}
      />
      <GlowOrb
        className="bottom-[-18%] end-[-12%] size-[30rem] bg-sky-400/15 dark:bg-sky-400/10"
        style={{ animationDelay: "-3s" }}
      />

      <FloatingIcon
        icon={Cpu}
        className="hidden border-primary/10 bg-surface-secondary text-accent-hover dark:border-white/15 dark:bg-white/5 dark:text-accent sm:flex top-[16%] start-[6%]"
        style={{ animationDelay: "0s" }}
      />
      <FloatingIcon
        icon={CircuitBoard}
        size="sm"
        className="hidden border-primary/10 bg-surface-secondary text-text-secondary dark:border-white/10 dark:bg-white/5 dark:text-white/70 lg:flex top-[68%] start-[10%]"
        style={{ animationDelay: "-2.4s" }}
      />
      <FloatingIcon
        icon={Orbit}
        className="hidden border-primary/10 bg-surface-secondary text-sky-600 dark:border-white/15 dark:bg-white/5 dark:text-sky-300 sm:flex top-[14%] end-[8%]"
        style={{ animationDelay: "-4.8s" }}
      />
      <FloatingIcon
        icon={Radar}
        size="sm"
        className="hidden border-primary/10 bg-surface-secondary text-text-secondary dark:border-white/10 dark:bg-white/5 dark:text-white/70 lg:flex bottom-[18%] end-[14%]"
        style={{ animationDelay: "-1.2s" }}
      />

      <Container className="relative grid gap-12 py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-start"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-4 py-1.5 text-sm text-text-secondary dark:border-white/15 dark:bg-white/5 dark:text-white/80"
          >
            <Bot className="size-4 text-accent" aria-hidden="true" />
            پژوهشکده رباتیک پیشنام
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            جامعه‌ای برای مهندسان <span className="text-gradient-accent">رباتیک</span>، هوش
            مصنوعی و فناوری
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-xl text-lg text-text-secondary">
            هر ماه گرد هم می‌آییم تا یاد بگیریم، گفتگو کنیم و شبکه‌سازی کنیم؛ در کنار
            مهندسان و علاقه‌مندانی که مسیر مشابهی را دنبال می‌کنند.
          </motion.p>

          {nextEvent ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-4 lg:items-start"
            >
              <p className="text-sm text-text-secondary">
                رویداد بعدی · {formatEventDate(nextEvent.date)}
              </p>
              <Countdown target={nextEvent.date} variant="auto" />
            </motion.div>
          ) : null}

          <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="accent"
              size="lg"
              className="transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(244,185,66,0.35)]"
            >
              <Link href={nextEvent ? `/events/${nextEvent.slug}` : "/events"}>
                ثبت نام رویداد
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">
                درباره پیشتاک
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ x: robotX, y: robotY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[220px] sm:max-w-xs lg:mx-0 lg:max-w-md"
        >
          <RobotMascot className="w-full" />
        </motion.div>
      </Container>

      <motion.a
        href="#next-event"
        aria-label="پیمایش به بخش بعدی"
        className="absolute inset-x-0 bottom-6 mx-auto flex size-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:text-text-primary dark:border-white/15 dark:text-white/60 dark:hover:text-white"
        animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5" aria-hidden="true" />
      </motion.a>
    </section>
  );
}

export { HeroSection };
