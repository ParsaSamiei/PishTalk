"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteEvent } from "@/features/admin/actions/eventActions";
import { useToast } from "@/providers/ToastProvider";

interface DeleteEventButtonProps {
  readonly eventId: string;
  readonly eventTitle: string;
}

function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleConfirm() {
    const result = await deleteEvent(eventId);
    if (result.success) {
      showToast("رویداد حذف شد", { variant: "success" });
      router.refresh();
    } else {
      showToast("حذف رویداد ناموفق بود", { variant: "danger", description: result.error });
    }
  }

  return (
    <ConfirmDialog
      title="حذف رویداد"
      description={`آیا از حذف «${eventTitle}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
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

export { DeleteEventButton };
