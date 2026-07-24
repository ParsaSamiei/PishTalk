"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import type { ActionResult } from "@/features/admin/actions/eventActions";

const addImageSchema = z.object({
  url: z.string().trim().url("آدرس تصویر معتبر نیست"),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
});

/**
 * Ensures a Gallery row exists for the event and appends one image to it.
 * There is no file-upload pipeline yet (docs don't specify a storage
 * provider), so images are added by URL until one is chosen.
 */
export async function addGalleryImage(
  eventId: string,
  values: { url: string; caption?: string }
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = addImageSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "آدرس تصویر معتبر نیست." };
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return { success: false, error: "رویداد یافت نشد." };

    const gallery = await prisma.gallery.upsert({
      where: { eventId },
      update: {},
      create: { eventId, title: event.title },
    });

    const lastMedia = await prisma.galleryMedia.findFirst({
      where: { galleryId: gallery.id },
      orderBy: { sortOrder: "desc" },
    });

    await prisma.galleryMedia.create({
      data: {
        galleryId: gallery.id,
        type: "IMAGE",
        url: parsed.data.url,
        caption: parsed.data.caption || null,
        sortOrder: (lastMedia?.sortOrder ?? -1) + 1,
      },
    });

    revalidatePath(`/admin/gallery/${eventId}`);
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "افزودن تصویر با خطا مواجه شد." };
  }
}

export async function removeGalleryImage(mediaId: string, eventId: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.galleryMedia.delete({ where: { id: mediaId } });
    revalidatePath(`/admin/gallery/${eventId}`);
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "حذف تصویر با خطا مواجه شد." };
  }
}
