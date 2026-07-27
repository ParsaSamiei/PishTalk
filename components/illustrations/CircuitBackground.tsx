import { cn } from "@/lib/utils";

interface CircuitBackgroundProps {
  /** Unique id so multiple instances on one page don't collide (SVG <pattern> ids are global). */
  readonly id: string;
  readonly className?: string;
  /**
   * Size of one repeating tile in px. Defaults to 90 (the scale used for
   * full-bleed sections). Pass a smaller value (e.g. 48) inside compact
   * panels like a countdown card, where a 90px tile would only repeat
   * once or twice and read as sparse or awkwardly cropped.
   */
  readonly size?: number;
}

/**
 * Tileable circuit-trace grid, rendered with `currentColor` so its tone is
 * set entirely via `className` (e.g. `"text-white/10"` on the dark hero,
 * `"text-primary/[0.04] dark:text-white/[0.05]"` on light sections).
 * Static SVG + no JS, so it can be used from Server Components.
 */
function CircuitBackground({ id, className, size = 90 }: CircuitBackgroundProps) {
  const patternId = `circuit-pattern-${id}`;
  const half = size / 2;
  const third = size / 3;
  const twoThirds = (size * 2) / 3;
  const nodeRadius = size * (2.5 / 90);
  const smallNodeRadius = size * (1.5 / 90);

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M${half} 0V${third}M${half} ${twoThirds}V${size}M0 ${half}H${third}M${twoThirds} ${half}H${size}M${third} ${third}H${twoThirds}V${twoThirds}H${third}Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx={half} cy={half} r={nodeRadius} fill="currentColor" />
          <circle cx={third} cy={third} r={smallNodeRadius} fill="currentColor" />
          <circle cx={twoThirds} cy={twoThirds} r={smallNodeRadius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export { CircuitBackground };
