import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Centers content and applies the responsive gutters defined in
 * docs/04_DESIGN_SYSTEM.md (16px mobile / 24px tablet / 32px desktop),
 * capped at the 1280px container width.
 */
function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export { Container };
