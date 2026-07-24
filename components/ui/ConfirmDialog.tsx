"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  readonly trigger: React.ReactNode;
  readonly title: string;
  readonly description?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly destructive?: boolean;
  readonly onConfirm: () => void | Promise<void>;
}

/**
 * On-brand replacement for window.confirm(), per docs/04_DESIGN_SYSTEM.md
 * ("Modals: Rounded 24px, Blur Background") and docs/07_ADMIN_PANEL.md
 * ("Confirmation Dialogs" before every destructive action). Native browser
 * confirm() can't be styled, ignores dir="rtl", and blocks the JS thread.
 */
function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  destructive = true,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);

  async function handleConfirm() {
    setIsConfirming(true);
    await onConfirm();
    setIsConfirming(false);
    setOpen(false);
  }

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
          <AlertDialogPrimitive.Content className="w-full max-w-sm rounded-[var(--radius-dialog)] border border-border bg-surface p-6 shadow-lg outline-none">
            <AlertDialogPrimitive.Title className="text-lg font-semibold text-text-primary">
              {title}
            </AlertDialogPrimitive.Title>
            {description ? (
              <AlertDialogPrimitive.Description className="mt-2 text-sm text-text-secondary">
                {description}
              </AlertDialogPrimitive.Description>
            ) : null}
            <div className="mt-6 flex items-center justify-end gap-3">
              <AlertDialogPrimitive.Cancel asChild>
                <Button type="button" variant="outline" size="sm">
                  {cancelLabel}
                </Button>
              </AlertDialogPrimitive.Cancel>
              <Button
                type="button"
                variant={destructive ? "danger" : "primary"}
                size="sm"
                isLoading={isConfirming}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Overlay>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

export { ConfirmDialog };
