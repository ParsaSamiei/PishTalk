import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionTitleProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly description?: string;
  readonly align?: "start" | "center";
  readonly className?: string;
}

/**
 * Consistent heading block reused across every homepage and listing section.
 */
function SectionTitle({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="text-sm font-semibold tracking-wide text-accent-hover">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
      {description ? (
        <p className="text-lg text-text-secondary">{description}</p>
      ) : null}
    </div>
  );
}

export { SectionTitle };
