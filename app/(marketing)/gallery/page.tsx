import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Images } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "گالری",
  description: "مجموعه تصاویر رویدادهای پیشتاک.",
  alternates: { canonical: `${SITE_URL}/gallery` },
};

interface GalleryGroup {
  readonly id: string;
  readonly eventSlug: string;
  readonly title: string;
  readonly coverImage: string | null;
  readonly imageCount: number;
  readonly videoCount: number;
}

async function getGalleries(): Promise<GalleryGroup[]> {
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
        title: gallery.title,
        coverImage: gallery.coverImage ?? gallery.media.find((m) => m.type === "IMAGE")?.url ?? null,
        imageCount: gallery.media.filter((m) => m.type === "IMAGE").length,
        videoCount: gallery.media.filter((m) => m.type === "VIDEO").length,
      }));
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const galleries = await getGalleries();

  return (
    <Section className="pt-12">
      <Container className="flex flex-col gap-10">
        <Breadcrumbs items={[{ label: "گالری" }]} />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">گالری</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            لحظاتی از رویدادهای برگزار شده پیشتاک را مرور کنید.
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
                  <h2 className="font-semibold text-text-primary">{gallery.title}</h2>
                  <p className="text-sm text-text-secondary">
                    {gallery.imageCount} تصویر
                    {gallery.videoCount > 0 ? ` · ${gallery.videoCount} ویدیو` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Images}
            title="گالری هنوز خالی است"
            description="پس از برگزاری اولین رویداد، تصاویر آن اینجا نمایش داده می‌شود."
          />
        )}
      </Container>
    </Section>
  );
}
