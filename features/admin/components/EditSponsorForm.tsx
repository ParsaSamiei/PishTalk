"use client";

import { useRouter } from "next/navigation";

import { SponsorForm } from "@/features/admin/components/SponsorForm";
import { updateSponsor } from "@/features/admin/actions/sponsorActions";
import type { SponsorFormValues } from "@/features/admin/types/sponsorForm";

interface EditSponsorFormProps {
  readonly sponsorId: string;
  readonly defaultValues: SponsorFormValues;
}

function EditSponsorForm({ sponsorId, defaultValues }: EditSponsorFormProps) {
  const router = useRouter();

  async function handleSubmit(values: SponsorFormValues) {
    const result = await updateSponsor(sponsorId, values);
    if (result.success) router.push("/admin/sponsors");
    return result;
  }

  return (
    <SponsorForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="ذخیره تغییرات"
    />
  );
}

export { EditSponsorForm };
