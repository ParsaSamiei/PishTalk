"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/providers/ToastProvider";

interface DeleteButtonProps {
  readonly confirmMessage: string;
  readonly action: () => Promise<{ success: boolean; error?: string }>;
}

/**
 * Generic delete-with-confirmation button reused across FAQ, Rules, and
 * other simple admin list pages. Uses ConfirmDialog rather than
 * window.confirm() — see docs/04_DESIGN_SYSTEM.md "Modals" and
 * docs/07_ADMIN_PANEL.md "Confirmation Dialogs".
 */
function DeleteButton({ confirmMessage, action }: DeleteButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleConfirm() {
    const result = await action();
    if (result.success) {
      showToast("حذف شد", { variant: "success" });
      router.refresh();
    } else {
      showToast("حذف ناموفق بود", { variant: "danger", description: result.error });
    }
  }

  return (
    <ConfirmDialog
      title="حذف مورد"
      description={confirmMessage}
      confirmLabel="حذف"
      onConfirm={handleConfirm}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="حذف"
          className="text-danger hover:bg-danger/10"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      }
    />
  );
}

export { DeleteButton };
