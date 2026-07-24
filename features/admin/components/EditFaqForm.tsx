"use client";

import { useRouter } from "next/navigation";

import { FaqForm } from "@/features/admin/components/FaqForm";
import { updateFaq } from "@/features/admin/actions/faqActions";
import type { FaqFormValues } from "@/features/admin/types/faqForm";

interface EditFaqFormProps {
  readonly faqId: string;
  readonly defaultValues: FaqFormValues;
}

function EditFaqForm({ faqId, defaultValues }: EditFaqFormProps) {
  const router = useRouter();

  async function handleSubmit(values: FaqFormValues) {
    const result = await updateFaq(faqId, values);
    if (result.success) router.push("/admin/faq");
    return result;
  }

  return <FaqForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="ذخیره تغییرات" />;
}

export { EditFaqForm };
