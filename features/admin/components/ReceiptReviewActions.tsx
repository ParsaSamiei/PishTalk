"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/providers/ToastProvider";
import { reviewSupportReceipt } from "@/features/admin/actions/supportReceiptActions";

interface ReceiptReviewActionsProps {
  readonly id: string;
  readonly fullName: string;
}

type Decision = "APPROVED" | "REJECTED";

const DECISION_COPY: Record<Decision, { title: string; confirm: string }> = {
  APPROVED: { title: "تأیید رسید", confirm: "تأیید" },
  REJECTED: { title: "رد رسید", confirm: "رد کردن" },
};

/**
 * Approve/reject a receipt, with an optional note recorded alongside the
 * decision (e.g. "مبلغ با رسید همخوانی ندارد").
 *
 * A dialog rather than a bare button because the note is the point: a rejected
 * receipt with no explanation is not much use to whoever reads the list next.
 */
function ReceiptReviewActions({ id, fullName }: ReceiptReviewActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [decision, setDecision] = React.useState<Decision | null>(null);
  const [note, setNote] = React.useState("");

  function close() {
    setDecision(null);
    setNote("");
  }

  function handleConfirm() {
    if (!decision) return;

    startTransition(async () => {
      const result = await reviewSupportReceipt({
        id,
        status: decision,
        adminNote: note,
      });

      if (result.success) {
        showToast(
          decision === "APPROVED" ? "رسید تأیید شد" : "رسید رد شد",
          { variant: "success" },
        );
        close();
        router.refresh();
      } else {
        showToast("ثبت وضعیت ناموفق بود", {
          variant: "danger",
          description: result.error,
        });
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`تأیید رسید ${fullName}`}
          onClick={() => setDecision("APPROVED")}
        >
          <Check className="size-4 text-success" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`رد رسید ${fullName}`}
          onClick={() => setDecision("REJECTED")}
        >
          <X className="size-4 text-danger" aria-hidden="true" />
        </Button>
      </div>

      <DialogPrimitive.Root
        open={decision !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-xl">
            <DialogPrimitive.Title className="text-lg font-semibold text-text-primary">
              {decision ? DECISION_COPY[decision].title : ""}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-text-secondary">
              رسید ارسالی توسط {fullName}
            </DialogPrimitive.Description>

            <div className="flex flex-col gap-2">
              <Label htmlFor="receiptAdminNote">
                یادداشت{" "}
                <span className="font-normal text-text-secondary">(اختیاری)</span>
              </Label>
              <Textarea
                id="receiptAdminNote"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={close}
                disabled={isPending}
              >
                انصراف
              </Button>
              <Button
                type="button"
                variant={decision === "REJECTED" ? "danger" : "primary"}
                size="sm"
                onClick={handleConfirm}
                isLoading={isPending}
              >
                {decision ? DECISION_COPY[decision].confirm : ""}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

export { ReceiptReviewActions };
