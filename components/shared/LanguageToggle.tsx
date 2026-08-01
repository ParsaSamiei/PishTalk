"use client";

import * as React from "react";

import { setLocaleAction } from "@/lib/i18n/actions";
import { useLocale } from "@/lib/i18n/client";
import {
  LOCALE_NAMES,
  LOCALE_SHORT_LABELS,
  type Locale,
} from "@/lib/i18n/config";

/**
 * Segmented slider for switching between Persian and English.
 *
 * Both locales stay visible and a gold thumb slides to the active one. The
 * thumb animates with `translate` rather than by flipping `start`/`end`:
 * swapping between an offset and `auto` is a discrete jump, so it would not
 * transition at all.
 *
 * Layout is a 2-column grid so both cells are exactly equal regardless of how
 * wide "فارسی" and "English" render — the thumb is exactly one cell wide, so
 * translating it by its own width lands it precisely on the other option.
 *
 * Direction is handled by the `rtl:` variant: the thumb starts at the inline
 * start (Persian, the first cell) and moves toward the inline end, which is
 * physically left in Persian and right in English.
 *
 * The locale lives in a cookie, so switching is a server action plus a full
 * layout re-render. `useOptimistic` moves the thumb on click instead of after
 * that round trip, which is what keeps the control feeling immediate.
 */
function LanguageToggle() {
  const { locale, dictionary } = useLocale();
  const [isPending, startTransition] = React.useTransition();
  const [selected, setSelected] = React.useOptimistic(locale);

  function handleSelect(next: Locale) {
    if (next === selected) return;

    startTransition(async () => {
      setSelected(next);
      await setLocaleAction(next);
    });
  }

  return (
    <div
      role="group"
      aria-label={dictionary.language.label}
      aria-busy={isPending}
      className="relative grid grid-cols-2 h-12 rounded-[var(--radius-button)] border border-border bg-surface-secondary p-1"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-1 start-1 w-[calc(50%-0.25rem)] rounded-[calc(var(--radius-button)-0.25rem)] bg-accent shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
          selected === "en" ? "translate-x-full rtl:-translate-x-full" : ""
        }`}
      />

      {(["fa", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleSelect(option)}
          aria-pressed={selected === option}
          title={LOCALE_NAMES[option]}
          className={`relative z-10 flex items-center justify-center rounded-[calc(var(--radius-button)-0.25rem)] px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-secondary ${
            selected === option
              ? "text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {/* Short label keeps the navbar compact where space is tight; the
              hidden one is display:none, so each breakpoint's accessible name
              still matches its visible text. */}
          <span className="lg:hidden">{LOCALE_SHORT_LABELS[option]}</span>
          <span className="hidden lg:inline">{LOCALE_NAMES[option]}</span>
        </button>
      ))}
    </div>
  );
}

export { LanguageToggle };
