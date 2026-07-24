import * as React from "react";

import { cn } from "@/lib/utils";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  readonly id?: string;
  /**
   * Adds a faint, theme-aware circuit-trace texture behind the section's
   * content, so the "circuit board" motif from the Hero carries through
   * the whole page rather than only appearing in a few isolated spots.
   * Every section here already passes a unique `id` for anchor links —
   * that same id is reused to keep the underlying SVG pattern id unique.
   */
  readonly circuit?: boolean;
};

/**
 * Vertical rhythm wrapper used between homepage and content-page sections.
 * Every section should tell one story (docs/09_DEVELOPMENT_GUIDELINES.md).
 */
function Section({ className, circuit = false, id, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-16 sm:py-20 lg:py-24", circuit && "overflow-hidden", className)}
      {...props}
    >
      {circuit ? (
        <CircuitBackground
          id={id ?? "section"}
          className="text-primary/[0.035] dark:text-white/[0.045]"
        />
      ) : null}
      {children}
    </section>
  );
}

export { Section };
