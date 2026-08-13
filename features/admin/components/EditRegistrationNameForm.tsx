"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/providers/ToastProvider";
import { updateRegistrationName } from "@/features/admin/actions/registrationActions";

interface EditRegistrationNameFormProps {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly certificateName: string | null;
}

/**
 * Admin-only edit for a registrant's firstName/lastName/certificateName,
 * mirroring RegistrationReviewActions' dialog pattern. Kept as its own
 * button+dialog rather than folded into the review dialog since it applies
 * regardless of status (PENDING/APPROVED/REJECTED alike).
 */
function EditRegistrationNameForm({
  id,
  firstName,
  lastName,
  certificateName,
}: EditRegistrationNameFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    firstName,
    lastName,
    certificateName: certificateName ?? "",
  });

  function openDialog() {
    setValues({ firstName, lastName, certificateName: certificateName ?? "" });
    setOpen(true);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateRegistrationName({ id, ...values });
      if (result.success) {
        showToast("نام ثبت‌نام ویرایش شد", { variant: "success" });
        setOpen(false);
        router.refresh();
      } else {
        showToast("ویرایش نام ناموفق بود", { variant: "danger", description: result.error });
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`ویرایش نام ${firstName} ${lastName}`}
        onClick={openDialog}
      >
        <Pencil className="size-4 text-text-secondary" aria-hidden="true" />
      </Button>

      <DialogPrimitive.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) setOpen(false);
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-xl">
            <DialogPrimitive.Title className="text-lg font-semibold text-text-primary">
              ویرایش نام ثبت‌نام
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-text-secondary">
              نام و نام خانوادگی و نام گواهی این ثبت‌نام را ویرایش کنید.
            </DialogPrimitive.Description>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editRegFirstName">نام</Label>
              <Input
                id="editRegFirstName"
                value={values.firstName}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, firstName: event.target.value }))
                }
                maxLength={50}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editRegLastName">نام خانوادگی</Label>
              <Input
                id="editRegLastName"
                value={values.lastName}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, lastName: event.target.value }))
                }
                maxLength={50}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editRegCertificateName">
                نام (گواهی) <span className="font-normal text-text-secondary">(اختیاری، لاتین)</span>
              </Label>
              <Input
                id="editRegCertificateName"
                dir="ltr"
                value={values.certificateName}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, certificateName: event.target.value }))
                }
                maxLength={100}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                انصراف
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={isPending}
              >
                ذخیره
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

export { EditRegistrationNameForm };
