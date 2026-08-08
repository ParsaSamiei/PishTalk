"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  /** The exact text placed on the clipboard — normalized, never formatted. */
  readonly value: string;
  /** Names the copied field for screen readers, e.g. "شماره کارت". */
  readonly label: string;
  readonly className?: string;
}

/**
 * Copies a short value (a card number, a SHEBA) to the clipboard.
 *
 * Distinct from ShareButton, which is specific to sharing a page URL via the
 * Web Share API. This one is a plain icon button for values shown beside it.
 *
 * The copied state is announced through an aria-live region rather than only
 * by swapping the icon, so the confirmation reaches screen reader users too.
 */
function CopyButton({ value, label, className }: CopyButtonProps) {
  const d = useDictionary();
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear on unmount: without this, the timer fires after the component is
  // gone and React warns about setting state on an unmounted component.
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API is unavailable (insecure origin, or denied). The value
      // is visible on screen and selectable, so there is nothing to recover.
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${d.support.copy} ${label}`}
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:border-accent/40 hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className,
        )}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} ${d.support.copied}` : ""}
      </span>
    </>
  );
}

export { CopyButton };
