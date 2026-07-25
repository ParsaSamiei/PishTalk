"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { toggleContactMessageRead } from "@/features/admin/actions/contactMessageActions";

interface ToggleReadButtonProps {
  readonly id: string;
  readonly isRead: boolean;
}

/**
 * Toggles a contact message between read/unread. Unlike DeleteButton this
 * needs no confirmation — it's fully reversible with one more click.
 */
function ToggleReadButton({ id, isRead }: ToggleReadButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleContactMessageRead(id, !isRead);
      if (result.success) {
        router.refresh();
      } else {
        showToast("به‌روزرسانی ناموفق بود", {
          variant: "danger",
          description: result.error,
        });
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isRead ? "علامت‌گذاری به‌عنوان خوانده‌نشده" : "علامت‌گذاری به‌عنوان خوانده‌شده"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isRead ? (
        <Mail className="size-4" aria-hidden="true" />
      ) : (
        <MailOpen className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}

export { ToggleReadButton };
