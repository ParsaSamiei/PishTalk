import { cn } from "@/lib/utils";

/**
 * Pulsing placeholder block used to build page/component skeletons.
 * Per docs/04_DESIGN_SYSTEM.md: "Never use spinners for page loading."
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[var(--radius-input)] bg-surface-secondary", className)}
      {...props}
    />
  );
}

export { Skeleton };
