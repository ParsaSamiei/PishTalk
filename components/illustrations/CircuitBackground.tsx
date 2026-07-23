import { cn } from "@/lib/utils";

interface CircuitBackgroundProps {
  /** Unique id so multiple instances on one page don't collide (SVG <pattern> ids are global). */
  readonly id: string;
  readonly className?: string;
}

/**
 * Tileable circuit-trace grid, rendered with `currentColor` so its tone is
 * set entirely via `className` (e.g. `"text-white/10"` on the dark hero,
 * `"text-primary/[0.04] dark:text-white/[0.05]"` on light sections).
 * Static SVG + no JS, so it can be used from Server Components.
 */
function CircuitBackground({ id, className }: CircuitBackgroundProps) {
  const patternId = `circuit-pattern-${id}`;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} width="90" height="90" patternUnits="userSpaceOnUse">
          <path
            d="M45 0V30M45 60V90M0 45H30M60 45H90M30 30H60V60H30Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="45" cy="45" r="2.5" fill="currentColor" />
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          <circle cx="60" cy="60" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export { CircuitBackground };
