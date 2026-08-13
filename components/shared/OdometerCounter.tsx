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
  duration = 3.2, // Slower, more impactful default speed
  className,
  once = true,
}: OdometerCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [started, setStarted] = React.useState(false);

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

  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-center font-mono font-extrabold tabular-nums",
        className,
      )}
    >
      {prefix ? <span className="me-1.5">{prefix}</span> : null}
      <span className="inline-flex items-center">
        {entries.map(({ char, digitIndex }, i) =>
          char === "," ? (
            <span key={`sep-${i}`} className="opacity-40 px-[0.05em]">
              {char}
            </span>
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
      {suffix ? <span className="ms-1.5">{suffix}</span> : null}

      <motion.span
        aria-hidden="true"
        className="sr-only"
        onViewportEnter={() => setStarted(true)}
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

/** A single rolling wheel: a 0–9 column that translates up to `digit`. */
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

  return (
    <span
      className="relative inline-block w-[0.72em] overflow-hidden align-top mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
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
                delay: index * 0.12,
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
  );
}

export { OdometerCounter };
