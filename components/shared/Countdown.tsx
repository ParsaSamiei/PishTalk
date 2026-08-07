"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { useDictionary, useLocale } from "@/lib/i18n/client"; // adjust to your actual export
import { cn } from "@/lib/utils";

interface CountdownProps {
  readonly target: Date;
  readonly className?: string;
  readonly variant?: "light" | "dark" | "auto";
}

type Unit = "days" | "hours" | "minutes" | "seconds";

// Order chosen so that, combined with the page's text direction,
// the VISUAL result is always: days, hours, minutes, seconds (left → right).
const UNITS_RTL: ReadonlyArray<Unit> = ["seconds", "minutes", "hours", "days"];
const UNITS_LTR: ReadonlyArray<Unit> = ["days", "hours", "minutes", "seconds"];

function Countdown({ target, className, variant = "light" }: CountdownProps) {
  const { locale, dictionary: d } = useLocale();

  const countdown = useCountdown(target);

  if (countdown.isPast) return null;

  const isRtl = locale === "fa"; // swap for your actual RTL check
  const UNITS = isRtl ? UNITS_RTL : UNITS_LTR;

  return (
    <div
      className={cn("flex items-center gap-3 sm:gap-4", className)}
      role="timer"
      aria-live="off"
      aria-label={d.nextEvent.countdownLabel}
    >
      {UNITS.map((unit) => (
        <div
          key={unit}
          className={cn(
            "flex w-16 flex-col items-center gap-1 rounded-2xl px-2 py-3 sm:w-20",
            variant === "light" && "bg-white/10 text-white",
            variant === "dark" && "bg-surface-secondary text-text-primary",
            variant === "auto" &&
              "bg-surface-secondary text-text-primary dark:bg-white/10 dark:text-white",
          )}
        >
          <span
            className="font-mono text-2xl font-bold text-accent sm:text-3xl"
            aria-hidden="true"
          >
            {String(countdown[unit]).padStart(2, "0")}
          </span>
          <span className="text-xs text-current/80">{d.countdown[unit]}</span>
        </div>
      ))}
    </div>
  );
}

export { Countdown };
