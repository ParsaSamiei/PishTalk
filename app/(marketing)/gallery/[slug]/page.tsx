import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { GalleryImageGrid } from "@/components/shared/GalleryImageGrid";
import { prisma } from "@/lib/prisma";
import { getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
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
  const { locale, dictionary: d } = await getLocaleContext();
  const event = await getEventGallery(slug);

  if (!event) return { title: d.gallery.notFound };

  const title = pick(locale, event.title, event.titleEn);

  return {
    title: `${d.gallery.galleryOf} ${title}`,
    description: `${d.gallery.mediaOf} ${title}`,
    alternates: { canonical: `${SITE_URL}/gallery/${event.slug}` },
  };
}

export default async function EventGalleryPage({ params }: EventGalleryPageProps) {
  const { locale, dictionary: d } = await getLocaleContext();
  const { slug } = await params;
  const event = await getEventGallery(slug);

  if (!event || !event.gallery) notFound();

  const title = pick(locale, event.title, event.titleEn);
  const images = event.gallery.media
    .filter((item) => item.type === "IMAGE")
    .map((item) => ({
      id: item.id,
      url: item.url,
      caption: pick(locale, item.caption, item.captionEn),
    }));
  const videos = event.gallery.media.filter((item) => item.type === "VIDEO");

  return (
    <Section className="pt-12" circuit>
      <Container className="flex flex-col gap-8">
        <Breadcrumbs
          items={[
            { label: d.gallery.pageTitle, href: "/gallery" },
            { label: title },
          ]}
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h1>
          <p className="text-text-secondary">{formatEventDate(event.date, locale)}</p>
        </div>

        {images.length === 0 && videos.length === 0 ? (
          <EmptyState icon={Images} title={d.gallery.noImages} />
        ) : (
          <>
            {images.length > 0 ? <GalleryImageGrid images={images} /> : null}

            {videos.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-text-primary">
                  {d.gallery.videosHeading}
                </h2>
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
