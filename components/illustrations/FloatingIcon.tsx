import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FloatingIconProps {
  readonly icon: LucideIcon;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly size?: "sm" | "md";
}

/**
 * A small glass chip holding a Lucide icon that drifts gently in place.
 * Used to scatter robotics/tech motifs (Cpu, CircuitBoard, Bot, Orbit...)
 * across section backgrounds per docs/02_BRAND_IDENTITY.md's icon rules
 * (Lucide only, outlined, consistent stroke). CSS-animated only, so it
 * stays server-renderable — no Framer Motion needed for an ambient loop.
 */
function FloatingIcon({ icon: Icon, className, style, size = "md" }: FloatingIconProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute flex items-center justify-center rounded-2xl border backdrop-blur-sm animate-drift",
        size === "md" ? "size-14" : "size-10",
        className
      )}
      style={style}
    >
      <Icon className={cn(size === "md" ? "size-6" : "size-4")} aria-hidden="true" />
    </div>
  );
}

export { FloatingIcon };
