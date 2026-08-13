"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, X, SendHorizonal } from "lucide-react";
import type { RegistrationStatus } from "@prisma/client";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { CopyButton } from "@/components/shared/CopyButton";
import { useToast } from "@/providers/ToastProvider";
import { SITE_URL } from "@/lib/constants";
import {
  reviewRegistration,
  resendApprovalSms,
} from "@/features/admin/actions/registrationActions";

interface RegistrationReviewActionsProps {
  readonly id: string;
  readonly fullName: string;
  readonly status: RegistrationStatus;
  readonly smsSentAt: string | null;
  readonly approvalToken: string;
}

type Decision = "APPROVED" | "REJECTED";

const DECISION_COPY: Record<Decision, { title: string; confirm: string }> = {
  APPROVED: { title: "تأیید ثبت‌نام", confirm: "تأیید" },
  REJECTED: { title: "رد ثبت‌نام", confirm: "رد کردن" },
};

/**
 * Approve/reject a pending registration, mirroring ReceiptReviewActions.
 *
 * Approving fires the FarazSMS approval notice server-side, unless
 * Settings > "ارسال خودکار پیامک تأیید" is off (see reviewRegistration in
 * registrationActions.ts) — in that case, and whenever a send attempt
 * fails, this renders a copy-link button alongside a send/resend button so
 * the admin can either hand the link out through another channel or fire
 * the SMS off manually, without re-reviewing the resume.
 */
function RegistrationReviewActions({
  id,
  fullName,
  status,
  smsSentAt,
  approvalToken,
}: RegistrationReviewActionsProps) {
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
      const result = await reviewRegistration({ id, status: decision, adminNote: note });

      if (result.success) {
        if (result.warning) {
          showToast("ثبت‌نام تأیید شد", { variant: "danger", description: result.warning });
        } else if (result.smsSkipped) {
          showToast("ثبت‌نام تأیید شد", {
            variant: "success",
            description: "ارسال خودکار پیامک غیرفعال است؛ لینک تأیید را کپی و ارسال کنید.",
          });
        } else {
          showToast(decision === "APPROVED" ? "ثبت‌نام تأیید شد" : "ثبت‌نام رد شد", {
            variant: "success",
          });
        }
        close();
        router.refresh();
      } else {
        showToast("ثبت وضعیت ناموفق بود", { variant: "danger", description: result.error });
      }
    });
  }

  function handleResend() {
    startTransition(async () => {
      const result = await resendApprovalSms(id);
      if (result.success) {
        showToast("پیامک ارسال شد", { variant: "success" });
        router.refresh();
      } else {
        showToast("ارسال پیامک ناموفق بود", { variant: "danger", description: result.error });
      }
    });
  }

  if (status === "APPROVED") {
    const approvalUrl = `${SITE_URL}/registration-status/${approvalToken}`;
    return (
      <div className="flex items-center gap-1">
        <CopyButton value={approvalUrl} label={`لینک تأیید ${fullName}`} />
        <Button
          type="button"
          variant={smsSentAt ? "ghost" : "outline"}
          size="sm"
          onClick={handleResend}
          isLoading={isPending}
          title={smsSentAt ? "ارسال دوباره پیامک تأییدیه" : "ارسال پیامک تأییدیه"}
        >
          <SendHorizonal className="size-4" aria-hidden="true" />
          {smsSentAt ? "ارسال دوباره" : "ارسال پیامک"}
        </Button>
      </div>
    );
  }

  if (status !== "PENDING") {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`تأیید ثبت‌نام ${fullName}`}
          onClick={() => setDecision("APPROVED")}
        >
          <Check className="size-4 text-success" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`رد ثبت‌نام ${fullName}`}
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
              ثبت‌نام {fullName}
              {decision === "APPROVED" &&
                " — در صورت فعال بودن ارسال خودکار (تنظیمات سایت)، پیامکی حاوی جزئیات رویداد برای این شماره ارسال می‌شود؛ در غیر این صورت لینک تأیید برای ارسال دستی در دسترس خواهد بود."}
            </DialogPrimitive.Description>

            <div className="flex flex-col gap-2">
              <Label htmlFor="registrationAdminNote">
                یادداشت <span className="font-normal text-text-secondary">(اختیاری)</span>
              </Label>
              <Textarea
                id="registrationAdminNote"
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

export { RegistrationReviewActions };
