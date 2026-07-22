"use client";

import { useRouter } from "next/navigation";

import { ResourceForm } from "@/features/admin/components/ResourceForm";
import { updateResource } from "@/features/admin/actions/resourceActions";
import type { ResourceFormValues } from "@/features/admin/types/resourceForm";

interface EditResourceFormProps {
  readonly resourceId: string;
  readonly defaultValues: Partial<ResourceFormValues>;
  readonly events: ReadonlyArray<{ id: string; title: string }>;
}

function EditResourceForm({ resourceId, defaultValues, events }: EditResourceFormProps) {
  const router = useRouter();

  async function handleSubmit(values: ResourceFormValues) {
    const result = await updateResource(resourceId, values);
    if (result.success) router.push("/admin/resources");
    return result;
  }

  return (
    <ResourceForm
      defaultValues={defaultValues}
      events={events}
      onSubmit={handleSubmit}
      submitLabel="ذخیره تغییرات"
    />
  );
}

export { EditResourceForm };
