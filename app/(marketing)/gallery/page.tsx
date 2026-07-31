import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Images } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { getDictionary, getLocaleContext } from "@/lib/i18n/server";
import { pick } from "@/lib/i18n/content";
import type { Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/constants";

// Prevents this page from being statically prerendered at Docker build time (when the DB may be empty/unreachable) and cached forever.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();

  return {
    title: d.gallery.pageTitle,
    description: d.gallery.metaDescription,
    alternates: { canonical: `${SITE_URL}/gallery` },
  };
}

interface GalleryGroup {
  readonly id: string;
  readonly eventSlug: string;
  readonly title: string;
  readonly coverImage: string | null;
  readonly imageCount: number;
  readonly videoCount: number;
}

async function getGalleries(locale: Locale): Promise<GalleryGroup[]> {
  try {
    const galleries = await prisma.gallery.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        event: { select: { slug: true } },
        media: { orderBy: { sortOrder: "asc" } },
      },
    });

    return galleries
      .filter((gallery) => gallery.media.length > 0)
      .map((gallery) => ({
        id: gallery.id,
        eventSlug: gallery.event.slug,
        title: pick(locale, gallery.title, gallery.titleEn),
        coverImage:
          gallery.coverImage ??
          gallery.media.find((m) => m.type === "IMAGE")?.url ??
          null,
        imageCount: gallery.media.filter((m) => m.type === "IMAGE").length,
        videoCount: gallery.media.filter((m) => m.type === "VIDEO").length,
      }));
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const { locale, dictionary: d } = await getLocaleContext();
  const galleries = await getGalleries(locale);

  return (
    <Section className="pt-12" circuit>
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: d.gallery.pageTitle }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            {d.gallery.pageTitle}
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            {d.gallery.lead}
          </p>
        </div>

        {galleries.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.eventSlug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
                  {gallery.coverImage ? (
                    <Image
                      src={gallery.coverImage}
                      alt={gallery.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-text-light">
                      <Images className="size-10" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <h2 className="font-semibold text-text-primary">
                    {gallery.title}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {gallery.imageCount} {d.gallery.images}
                    {gallery.videoCount > 0
                      ? ` · ${gallery.videoCount} ${d.gallery.videos}`
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Images}
            title={d.gallery.emptyTitle}
            description={d.gallery.emptyDescription}
          />
        )}
      </Container>
    </Section>
  );
}
