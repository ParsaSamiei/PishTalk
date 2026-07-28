"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import type { ActionResult } from "@/features/admin/actions/eventActions";

const addImageSchema = z.object({
  url: z
    .string()
    .trim()
    .refine((val) => val.startsWith("/") || /^https?:\/\//.test(val), {
      message: "آدرس تصویر معتبر نیست",
    }),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
});

/**
 * Ensures a Gallery row exists for the event and appends one image to it.
 * Images are uploaded through the admin panel via /api/admin/upload, which
 * returns a relative /uploads/... path; a full https URL is still accepted
 * as a fallback.
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
