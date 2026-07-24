import Link from "next/link";
import { Images } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { prisma } from "@/lib/prisma";
import { formatEventDate } from "@/utils/formatDate";

export default async function AdminGalleryPage() {
  const events = await prisma.event.findMany({
    where: { deletedAt: null },
    orderBy: { date: "desc" },
    include: { gallery: { include: { _count: { select: { media: true } } } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">گالری</h1>
        <p className="text-text-secondary">
          هر رویداد یک گالری اختصاصی دارد. برای افزودن یا حذف تصویر وارد شوید.
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState title="هنوز رویدادی ثبت نشده است" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/admin/gallery/${event.id}`}>
              <Card className="flex h-full flex-col gap-3 hover:-translate-y-0.5">
                <div className="flex items-center gap-2 text-accent-hover">
                  <Images className="size-5" aria-hidden="true" />
                  <Badge variant="neutral">{event.gallery?._count.media ?? 0} تصویر</Badge>
                </div>
                <h2 className="font-semibold text-text-primary">{event.title}</h2>
                <p className="text-sm text-text-secondary">{formatEventDate(event.date)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
