import { prisma } from "@/lib/prisma";
import type { GalleryPreviewImage } from "@/features/gallery/types/gallery";

/**
 * Latest gallery images across every event, for the homepage
 * "Gallery Preview" masonry section.
 */
export async function getLatestGalleryImages(limit = 8): Promise<GalleryPreviewImage[]> {
  try {
    const media = await prisma.galleryMedia.findMany({
      where: { type: "IMAGE" },
      orderBy: { id: "desc" },
      take: limit,
    });

    return media.map((item) => ({
      id: item.id,
      url: item.url,
      caption: item.caption,
    }));
  } catch {
    return [];
  }
}
