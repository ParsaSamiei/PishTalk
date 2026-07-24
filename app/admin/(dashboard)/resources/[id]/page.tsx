import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditResourceForm } from "@/features/admin/components/EditResourceForm";

interface EditResourcePageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditResourcePage({ params }: EditResourcePageProps) {
  const { id } = await params;
  const [resource, events] = await Promise.all([
    prisma.resource.findUnique({ where: { id } }),
    prisma.event.findMany({
      where: { deletedAt: null },
      orderBy: { date: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!resource) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">ویرایش منبع</h1>
      <EditResourceForm
        resourceId={resource.id}
        events={events}
        defaultValues={{
          title: resource.title,
          description: resource.description ?? "",
          resourceType: resource.resourceType,
          fileUrl: resource.fileUrl ?? "",
          externalUrl: resource.externalUrl ?? "",
          eventId: resource.eventId ?? "",
        }}
      />
    </div>
  );
}
