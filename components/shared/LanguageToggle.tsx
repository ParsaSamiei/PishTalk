"use client";

import * as React from "react";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { setLocaleAction } from "@/lib/i18n/actions";
import { useLocale } from "@/lib/i18n/client";
import { LOCALE_SHORT_LABELS, type Locale } from "@/lib/i18n/config";

/**
 * Switches between Persian and English. Sits next to ThemeToggle in the
 * navbar.
 *
 * The locale lives in a cookie, so flipping it is a server action followed by
 * a re-render of the whole layout (the `dir` attribute on <html> changes too).
 * `isPending` keeps the button disabled during that round trip so a double
 * click can't queue two opposite switches.
 *
 * Unlike ThemeToggle this needs no mounted-guard: the locale comes from the
 * server via LocaleProvider, so the first client render already matches.
 */
function LanguageToggle() {
  const { locale, dictionary } = useLocale();
  const [isPending, startTransition] = React.useTransition();

  const next: Locale = locale === "fa" ? "en" : "fa";

  function handleClick() {
    startTransition(() => {
      void setLocaleAction(next);
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      // Not size="icon": that's a fixed square and would clip the FA/EN label.
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      aria-label={dictionary.language.switchTo}
      title={dictionary.language.switchTo}
      className="h-12 gap-1.5 px-3 text-sm font-semibold"
    >
      <Languages aria-hidden="true" />
      <span aria-hidden="true">{LOCALE_SHORT_LABELS[next]}</span>
    </Button>
  );
}

export { LanguageToggle };
