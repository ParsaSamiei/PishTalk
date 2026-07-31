"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/lib/i18n/client";

interface ShareButtonProps {
  readonly title: string;
  readonly url: string;
}

/**
 * "Share Event" / "Share" affordance required on event and blog detail
 * pages (docs/03_Information_Architecture.md). Uses the native Web Share
 * API where available, falling back to copying the link to the clipboard.
 */
function ShareButton({ title, url }: ShareButtonProps) {
  const d = useDictionary();
  const [copied, setCopied] = React.useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; nothing more we can do silently.
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          {d.common.linkCopied}
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden="true" />
          {d.common.share}
        </>
      )}
    </Button>
  );
}

export { ShareButton };
