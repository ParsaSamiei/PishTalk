"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

interface CountdownProps {
  readonly target: Date;
  readonly className?: string;
  readonly variant?: "light" | "dark";
}

const UNITS: ReadonlyArray<{
  key: "days" | "hours" | "minutes" | "seconds";
  label: string;
}> = [
  { key: "seconds", label: "ثانیه" },
  { key: "minutes", label: "دقیقه" },
  { key: "hours", label: "ساعت" },
  { key: "days", label: "روز" },
];

/**
 * Live countdown boxes to the next event, per docs/04_DESIGN_SYSTEM.md
 * ("Rounded", "Large Numbers", "Accent Color", "Updates live").
 */
function Countdown({ target, className, variant = "light" }: CountdownProps) {
  const countdown = useCountdown(target);

  if (countdown.isPast) return null;

  return (
    <div
      className={cn("flex items-center gap-3 sm:gap-4", className)}
      role="timer"
      aria-live="off"
      aria-label="زمان باقی‌مانده تا رویداد بعدی"
    >
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className={cn(
            "flex w-16 flex-col items-center gap-1 rounded-2xl px-2 py-3 sm:w-20",
            variant === "light"
              ? "bg-white/10 text-white"
              : "bg-surface-secondary text-text-primary",
          )}
        >
          <span
            className="font-mono text-2xl font-bold text-accent sm:text-3xl"
            aria-hidden="true"
          >
            {String(countdown[unit.key]).padStart(2, "0")}
          </span>
          <span className="text-xs text-current/80">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

export { Countdown };
