import * as React from "react";

import { cn } from "@/lib/utils";

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  readonly id?: string;
};

/**
 * Vertical rhythm wrapper used between homepage and content-page sections.
 * Every section should tell one story (docs/09_DEVELOPMENT_GUIDELINES.md).
 */
function Section({ className, ...props }: SectionProps) {
  return <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props} />;
}

export { Section };
