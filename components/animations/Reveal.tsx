"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface RevealProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** Delay in seconds, used to stagger sibling reveals (e.g. `index * 0.08`). */
  readonly delay?: number;
  /** Distance in pixels the element rises from. */
  readonly y?: number;
  /** Whether the reveal plays once or every time it re-enters the viewport. */
  readonly once?: boolean;
}

/**
 * Fade + rise-in wrapper triggered when its content scrolls into view.
 * This is the single Framer Motion primitive used across the homepage so
 * every section (About, Why Attend, Timeline, Gallery, etc.) can opt into
 * the same entrance animation without becoming a Client Component itself —
 * only this leaf wrapper needs `"use client"`.
 *
 * Respects `prefers-reduced-motion` by collapsing to a plain fade.
 */
function Reveal({ children, className, delay = 0, y = 24, once = true }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export { Reveal };
