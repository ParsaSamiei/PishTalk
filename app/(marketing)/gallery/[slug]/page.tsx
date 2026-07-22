import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { GalleryImageGrid } from "@/components/shared/GalleryImageGrid";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import { formatEventDate } from "@/utils/formatDate";

interface EventGalleryPageProps {
  readonly params: Promise<{ slug: string }>;
}

async function getEventGallery(slug: string) {
  try {
    const event = await prisma.event.findFirst({
      where: { slug, deletedAt: null },
      include: {
        gallery: { include: { media: { orderBy: { sortOrder: "asc" } } } },
      },
    });
    return event;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: EventGalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventGallery(slug);

  if (!event) return { title: "گالری یافت نشد" };

  return {
    title: `گالری ${event.title}`,
    description: `تصاویر و ویدیوهای رویداد ${event.title}`,
    alternates: { canonical: `${SITE_URL}/gallery/${event.slug}` },
  };
}

export default async function EventGalleryPage({ params }: EventGalleryPageProps) {
  const { slug } = await params;
  const event = await getEventGallery(slug);

  if (!event || !event.gallery) notFound();

  const images = event.gallery.media.filter((item) => item.type === "IMAGE");
  const videos = event.gallery.media.filter((item) => item.type === "VIDEO");

  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-8">
        <Breadcrumbs items={[{ label: "گالری", href: "/gallery" }, { label: event.title }]} />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{event.title}</h1>
          <p className="text-text-secondary">{formatEventDate(event.date)}</p>
        </div>

        {images.length === 0 && videos.length === 0 ? (
          <EmptyState icon={Images} title="تصویری برای این رویداد ثبت نشده است" />
        ) : (
          <>
            {images.length > 0 ? <GalleryImageGrid images={images} /> : null}

            {videos.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-text-primary">ویدیوها</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {videos.map((video) => (
                    <video
                      key={video.id}
                      src={video.url}
                      controls
                      className="w-full rounded-[var(--radius-card)] bg-primary"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </Section>
  );
}
