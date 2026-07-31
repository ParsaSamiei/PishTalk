import Image from "next/image";
import Link from "next/link";
import { Images } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { ForwardArrow } from "@/components/shared/DirectionalIcon";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import type { GalleryPreviewImage } from "@/features/gallery/types/gallery";
import { pick } from "@/lib/i18n/content";
import { getLocaleContext } from "@/lib/i18n/server";

interface GalleryPreviewSectionProps {
  readonly images: readonly GalleryPreviewImage[];
}

/**
 * "What does Pishtalk look like?" homepage section — a masonry preview
 * of recent event photography.
 */
async function GalleryPreviewSection({ images }: GalleryPreviewSectionProps) {
  const { locale, dictionary: d } = await getLocaleContext();

  return (
    <Section id="gallery-preview" className="bg-surface-secondary" circuit>
      <Container className="flex flex-col gap-10">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            eyebrow={d.gallery.pageTitle}
            title={d.gallery.sectionTitle}
          />
          {images.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/gallery">
                {d.gallery.viewFull}
                <ForwardArrow className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </Reveal>

        {images.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {images.map((image, index) => (
              <Reveal key={image.id} delay={(index % 8) * 0.06} y={16}>
                <div className="group relative overflow-hidden rounded-[var(--radius-card)] bg-surface">
                  <Image
                    src={image.url}
                    alt={
                      pick(locale, image.caption, image.captionEn) ??
                      d.gallery.imageAlt
                    }
                    width={480}
                    height={480}
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <EmptyState
              icon={Images}
              title={d.gallery.emptyTitle}
              description={d.gallery.homeEmptyDescription}
            />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

export { GalleryPreviewSection };
