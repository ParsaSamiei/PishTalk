"use client";

import * as React from "react";
import { motion, useReducedMotion, type Easing } from "framer-motion";

import { cn } from "@/lib/utils";

interface OdometerCounterProps {
  /** Final value to land on, e.g. the total registered count. */
  readonly value: number;
  /** Optional text placed before the digits, outside the rolling wheels. */
  readonly prefix?: string;
  /** Optional text placed after the digits, outside the rolling wheels. */
  readonly suffix?: string;
  /** Seconds the roll-up animation takes once it starts. */
  readonly duration?: number;
  readonly className?: string;
  /** Whether the roll-up plays once or every time it re-enters view. */
  readonly once?: boolean;
}

// Every digit wheel always contains the full 0–9 run, so a "7" is reached
// by rolling forward from 0 to 7 — this is what reads as a mechanical
// odometer rather than a plain fade/count-up.
const WHEEL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

// Height of a single digit row, in em (relative to whatever font-size the
// caller applies). Single source of truth for row height — both the row
// spans and the roll-up offset read from this constant so they can't drift
// out of sync. IMPORTANT: this must stay in em, not %. A percentage on a
// `transform: translateY()` resolves against the *transformed element's
// own* height (11.5em, ten stacked rows) rather than one row, so
// `-${digit * 100}%` would overshoot by 10x and scroll every digit clean
// off screen — the bug that made the whole counter render blank.
// Slight height bump to give digits ample breathing room inside the wheel slot.
const ROW_HEIGHT_EM = 1.25;

// Matches the easing curve used by the Reveal wrapper elsewhere on the
// homepage, so this feels like the same motion language, not a bolted-on
// widget.
// Custom ease-out curve that starts deliberately and smoothly glides to a stop
const SMOOTH_EASE: Easing = [0.22, 1, 0.36, 1];

/**
 * Odometer-style rolling digit counter for landing-page social-proof
 * numbers (e.g. "N people have registered"). Rolls into view once, driven
 * by Framer Motion — the same trigger pattern as `Reveal`, just applied
 * per digit instead of to a whole block.
 *
 * Digits stay left-to-right even on this always-RTL site: numerals read
 * the same direction in Persian and English, so the wheel is wrapped in
 * `dir="ltr"` to stop the surrounding RTL context from reversing digit
 * order or where the prefix/suffix land.
 */
function OdometerCounter({
  value,
  prefix,
  suffix,
  duration = 3.6, // Slower, more impactful default speed
  className,
  once = true,
}: OdometerCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [started, setStarted] = React.useState(false);

  // The badge sits in the hero, so it's already on-screen the instant the
  // page loads — without a small settle delay the roll can kick off while
  // the page is still painting/hydrating and only the tail end is caught.
  // This timer just gives it a beat before starting, it doesn't affect how
  // long the roll itself takes.
  const startTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const handleViewportEnter = React.useCallback(() => {
    startTimer.current = setTimeout(() => setStarted(true), 350);
  }, []);
  React.useEffect(() => () => clearTimeout(startTimer.current), []);

  // entry gets its rolling-wheel index precomputed up front (rather than
  const chars = Math.max(0, Math.round(value))
    .toLocaleString("en-US")
    .split("");
  let nextDigitIndex = 0;
  const entries = chars.map((char) =>
    char === ","
      ? { char, digitIndex: -1 }
      : { char, digitIndex: nextDigitIndex++ },
  );

  // Screen readers get the plain formatted number; the rolling wheels
  // themselves are decorative and hidden from the accessibility tree so
  // the animation doesn't get announced digit-by-digit.
  const formattedValue = chars.join("");

  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-center font-mono font-extrabold tabular-nums",
        className,
      )}
    >
      {prefix ? <span className="me-1.5">{prefix}</span> : null}
      <span aria-hidden="true" className="inline-flex items-center gap-[0.09em]">
        {entries.map(({ char, digitIndex }, i) =>
          char === "," ? (
            <span
              key={`sep-${i}`}
              className="mx-[0.02em] inline-block h-[0.4em] w-px self-center rounded-full bg-current opacity-25"
            />
          ) : (
            <OdometerDigit
              key={`digit-${i}`}
              digit={Number(char)}
              index={digitIndex}
              duration={duration}
              started={started || Boolean(shouldReduceMotion)}
              instant={Boolean(shouldReduceMotion)}
            />
          ),
        )}
      </span>
      <span className="sr-only">{formattedValue}</span>
      {suffix ? <span className="ms-1.5">{suffix}</span> : null}

      <motion.span
        aria-hidden="true"
        className="sr-only"
        onViewportEnter={handleViewportEnter}
        viewport={{ once, margin: "-80px" }}
      />
    </span>
  );
}

interface OdometerDigitProps {
  readonly digit: number;
  readonly index: number;
  readonly duration: number;
  readonly started: boolean;
  readonly instant: boolean;
}

/**
 * A single rolling wheel: a 0–9 column that translates up to `digit`,
 * housed in a small beveled "drum" tile so it reads as one mechanical
 * barrel among several, rather than a flat row of digits.
 */
function OdometerDigit({
  digit,
  index,
  duration,
  started,
  instant,
}: OdometerDigitProps) {
  // keep in sync.
  const rowStyle: React.CSSProperties = {
    height: `${ROW_HEIGHT_EM}em`,
    lineHeight: `${ROW_HEIGHT_EM}em`,
  };

  // Cascading delay shared by the roll and the little settle-bounce that
  // follows it, so the bounce only kicks in once that column's roll has
  // actually finished.
  const rollDelay = index * 0.12;

  return (
    <motion.span
      className="relative inline-block w-[0.86em] rounded-[0.16em] border border-black/10 bg-gradient-to-b from-white/90 via-white/50 to-black/5 align-top shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.08)] dark:border-white/10 dark:from-white/15 dark:via-white/5 dark:to-black/20 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-2px_3px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.25)]"
      style={rowStyle}
      initial={{ scale: 1 }}
      animate={
        instant || !started
          ? { scale: 1 }
          : { scale: [1, 1.12, 0.97, 1] }
      }
      transition={
        instant
          ? { duration: 0 }
          : {
              delay: duration + rollDelay - 0.08,
              duration: 0.42,
              ease: "easeOut",
            }
      }
    >
      {/* Rolling digit column, clipped and faded at the edges so numerals
          appear to scroll up out of / down into the drum. */}
      <span
        className="absolute inset-0 overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)]"
        style={rowStyle}
      >
        <motion.span
          className="absolute inset-x-0 top-0 flex flex-col items-center will-change-transform"
          initial={{ y: "0em" }}
          animate={{ y: started ? `${-(digit * ROW_HEIGHT_EM)}em` : "0em" }}
          transition={
            instant
              ? { duration: 0 }
              : {
                  type: "tween",
                  duration,
                  ease: SMOOTH_EASE,
                  // Increased delay per digit column for a more visible cascading roll
                  delay: rollDelay,
                }
          }
        >
          {WHEEL.map((n) => (
            <span key={n} style={rowStyle} className="select-none">
              {n}
            </span>
          ))}
        </motion.span>
      </span>

      {/* Glossy highlight across the top of the drum, purely decorative. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[0.16em] bg-gradient-to-b from-white/50 to-transparent dark:from-white/10"
      />
      {/* Faint centerline seam, evoking the split of a real odometer drum. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/10 dark:bg-black/30"
      />
    </motion.span>
  );
}

export { OdometerCounter };