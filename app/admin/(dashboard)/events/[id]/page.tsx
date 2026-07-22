import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditEventForm } from "@/features/admin/components/EditEventForm";

interface EditEventPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { timeline: { orderBy: { sortOrder: "asc" } } },
  });

  if (!event) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">ویرایش رویداد</h1>
        <p className="text-text-secondary">{event.title}</p>
      </div>
      <EditEventForm
        eventId={event.id}
        defaultValues={{
          title: event.title,
          slug: event.slug,
          subtitle: event.subtitle ?? "",
          description: event.description,
          coverImage: event.coverImage ?? "",
          date: event.date.toISOString(),
          startTime: event.startTime,
          endTime: event.endTime ?? "",
          location: event.location,
          speakerName: event.speakerName ?? "",
          speakerBio: event.speakerBio ?? "",
          capacity: event.capacity ?? "",
          status: event.status,
          timeline: event.timeline.map((item) => ({
            time: item.time,
            title: item.title,
            description: item.description ?? "",
          })),
        }}
      />
    </div>
  );
}
