"use client";

import * as React from "react";

export interface CountdownValue {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly isPast: boolean;
}

function computeCountdown(target: Date): CountdownValue {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Live countdown to a target date, updated every second.
 * Used by the Hero and Next Event sections.
 *
 * Starts at zero and computes the real value only after mount, since
 * Date.now() would otherwise differ between server and client render
 * and trigger a hydration mismatch.
 */
export function useCountdown(target: Date): CountdownValue {
  const [value, setValue] = React.useState<CountdownValue>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: Date.now() must only run client-side to avoid a hydration mismatch
    setValue(computeCountdown(target));
    const interval = setInterval(() => {
      setValue(computeCountdown(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return value;
}
