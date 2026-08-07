"use client";

import * as React from "react";

import { Button } from "@/components/ui/Button";
import { setLocaleAction } from "@/lib/i18n/actions";
import { useLocale } from "@/lib/i18n/client";
import { LOCALE_SHORT_LABELS, type Locale } from "@/lib/i18n/config";

const OTHER_LOCALE: Record<Locale, Locale> = { fa: "en", en: "fa" };

/**
 * Compact language switcher, sized and shaped like ThemeToggle.
 *
 * Shows the label of the locale you'll switch TO (mirrors the "moon when
 * light / sun when dark" convention on ThemeToggle: the icon/label always
 * represents the destination state, not the current one).
 */
function LanguageToggle() {
  const { locale, dictionary } = useLocale();
  const [isPending, startTransition] = React.useTransition();
  const [selected, setSelected] = React.useOptimistic(locale);

  const target = OTHER_LOCALE[selected];

  function handleToggle() {
    startTransition(async () => {
      setSelected(target);
      await setLocaleAction(target);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={dictionary.language.switchTo}
      aria-busy={isPending}
      onClick={handleToggle}
      className="font-semibold text-sm"
    >
      {LOCALE_SHORT_LABELS[target]}
    </Button>
  );
}

export { LanguageToggle };
