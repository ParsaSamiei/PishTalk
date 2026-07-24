import * as React from "react";

import { cn } from "@/lib/utils";

interface GlowOrbProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

/**
 * Soft blurred gradient blob used to add depth and colour behind hero and
 * section content. Purely decorative (CSS-animated, no JavaScript) so it
 * stays inside Server Components. Position, size and colour are controlled
 * entirely through `className` (e.g. `"top-[-10%] start-[-5%] size-96 bg-accent/25"`).
 */
function GlowOrb({ className, style }: GlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl animate-float",
        className
      )}
      style={style}
    />
  );
}

export { GlowOrb };
