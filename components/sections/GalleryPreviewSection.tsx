import Image from "next/image";
import Link from "next/link";
import { Images, ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import type { GalleryPreviewImage } from "@/features/gallery/types/gallery";

interface GalleryPreviewSectionProps {
  readonly images: readonly GalleryPreviewImage[];
}

/**
 * "What does Pishtalk look like?" homepage section — a masonry preview
 * of recent event photography.
 */
function GalleryPreviewSection({ images }: GalleryPreviewSectionProps) {
  return (
    <Section id="gallery-preview" className="bg-surface-secondary">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle eyebrow="گالری" title="لحظاتی از رویدادهای پیشتاک" />
          {images.length > 0 ? (
            <Button asChild variant="ghost">
              <Link href="/gallery">
                مشاهده گالری کامل
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {images.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-[var(--radius-card)] bg-surface"
              >
                <Image
                  src={image.url}
                  alt={image.caption ?? "تصویری از رویداد پیشتاک"}
                  width={480}
                  height={480}
                  className="h-auto w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Images}
            title="گالری هنوز خالی است"
            description="پس از برگزاری اولین رویداد، تصاویر آن در همین بخش نمایش داده خواهد شد."
          />
        )}
      </Container>
    </Section>
  );
}

export { GalleryPreviewSection };
