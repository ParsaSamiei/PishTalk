"use client";

import * as React from "react";
import Image from "next/image";

import { GalleryLightbox, type LightboxImage } from "@/components/shared/GalleryLightbox";

interface GalleryImageGridProps {
  readonly images: readonly LightboxImage[];
}

function GalleryImageGrid({ images }: GalleryImageGridProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="block w-full overflow-hidden rounded-[var(--radius-card)] bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src={image.url}
              alt={image.caption ?? ""}
              width={480}
              height={480}
              className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <GalleryLightbox
          images={images}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </>
  );
}

export { GalleryImageGrid };
