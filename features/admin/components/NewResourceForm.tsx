"use client";

import { useRouter } from "next/navigation";

import { ResourceForm } from "@/features/admin/components/ResourceForm";
import { createResource } from "@/features/admin/actions/resourceActions";
import type { ResourceFormValues } from "@/features/admin/types/resourceForm";

interface NewResourceFormProps {
  readonly events: ReadonlyArray<{ id: string; title: string }>;
}

function NewResourceForm({ events }: NewResourceFormProps) {
  const router = useRouter();

  async function handleSubmit(values: ResourceFormValues) {
    const result = await createResource(values);
    if (result.success) {
      router.push("/admin/resources");
      router.refresh();
    }
    return result;
  }

  return <ResourceForm events={events} onSubmit={handleSubmit} submitLabel="ایجاد منبع" />;
}

export { NewResourceForm };
