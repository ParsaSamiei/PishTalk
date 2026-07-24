"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export interface LightboxImage {
  readonly id: string;
  readonly url: string;
  readonly caption: string | null;
}

interface GalleryLightboxProps {
  readonly images: readonly LightboxImage[];
  readonly startIndex: number;
  readonly onClose: () => void;
}

/**
 * Full-screen gallery viewer. Built on Embla Carousel — the project's
 * required carousel library (docs/00_AI_INSTRUCTIONS.md tech stack) — which
 * gives keyboard and swipe navigation for free, satisfying
 * docs/04_DESIGN_SYSTEM.md's "Lightbox, Keyboard Navigation, Swipe Support".
 */
function GalleryLightbox({ images, startIndex, onClose }: GalleryLightboxProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex, direction: "rtl", loop: true });

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") emblaApi?.scrollNext();
      if (event.key === "ArrowRight") emblaApi?.scrollPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="نمایش تصاویر گالری"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="absolute top-4 end-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="تصویر قبلی"
        className="absolute start-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="تصویر بعدی"
        className="absolute end-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>

      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image) => (
            <div key={image.id} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={image.url}
                alt={image.caption ?? ""}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { GalleryLightbox };
