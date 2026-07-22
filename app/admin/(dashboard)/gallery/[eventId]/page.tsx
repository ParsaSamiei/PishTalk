import { notFound } from "next/navigation";
import Image from "next/image";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteButton } from "@/features/admin/components/DeleteButton";
import { AddGalleryImageForm } from "@/features/admin/components/AddGalleryImageForm";
import { removeGalleryImage } from "@/features/admin/actions/galleryActions";
import { prisma } from "@/lib/prisma";
import { Images } from "lucide-react";

interface AdminEventGalleryPageProps {
  readonly params: Promise<{ eventId: string }>;
}

export default async function AdminEventGalleryPage({ params }: AdminEventGalleryPageProps) {
  const { eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { gallery: { include: { media: { orderBy: { sortOrder: "asc" } } } } },
  });

  if (!event) notFound();

  const media = event.gallery?.media ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">گالری: {event.title}</h1>
        <p className="text-text-secondary">افزودن یا حذف تصاویر این رویداد</p>
      </div>

      <Card>
        <AddGalleryImageForm eventId={event.id} />
      </Card>

      {media.length === 0 ? (
        <EmptyState icon={Images} title="هنوز تصویری اضافه نشده است" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface-secondary"
            >
              <div className="relative aspect-square w-full">
                <Image src={item.url} alt={item.caption ?? ""} fill className="object-cover" />
              </div>
              <div className="absolute top-2 end-2 rounded-full bg-surface/90 backdrop-blur-sm">
                <DeleteButton
                  confirmMessage="آیا از حذف این تصویر مطمئن هستید؟"
                  action={removeGalleryImage.bind(null, item.id, event.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
