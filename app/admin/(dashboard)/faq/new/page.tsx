"use client";

import { useRouter } from "next/navigation";

import { FaqForm } from "@/features/admin/components/FaqForm";
import { createFaq } from "@/features/admin/actions/faqActions";
import type { FaqFormValues } from "@/features/admin/types/faqForm";

export default function NewFaqPage() {
  const router = useRouter();

  async function handleSubmit(values: FaqFormValues) {
    const result = await createFaq(values);
    if (result.success) {
      router.push("/admin/faq");
      router.refresh();
    }
    return result;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">سوال جدید</h1>
      </div>
      <FaqForm onSubmit={handleSubmit} submitLabel="ایجاد سوال" />
    </div>
  );
}
