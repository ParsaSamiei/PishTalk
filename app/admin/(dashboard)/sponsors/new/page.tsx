"use client";

import { useRouter } from "next/navigation";

import { SponsorForm } from "@/features/admin/components/SponsorForm";
import { createSponsor } from "@/features/admin/actions/sponsorActions";
import type { SponsorFormValues } from "@/features/admin/types/sponsorForm";

export default function NewSponsorPage() {
  const router = useRouter();

  async function handleSubmit(values: SponsorFormValues) {
    const result = await createSponsor(values);
    if (result.success) {
      router.push("/admin/sponsors");
      router.refresh();
    }
    return result;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">حامی جدید</h1>
      <SponsorForm onSubmit={handleSubmit} submitLabel="ایجاد حامی" />
    </div>
  );
}
