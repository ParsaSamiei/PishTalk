"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { eventFormSchema, type EventFormValues } from "@/features/admin/types/eventForm";
import { blankToNull } from "@/features/admin/actions/normalize";

export interface ActionResult {
  readonly success: boolean;
  readonly error?: string;
}

const TRANSLATABLE = [
  "titleEn",
  "subtitleEn",
  "descriptionEn",
  "locationEn",
  "speakerNameEn",
  "speakerBioEn",
  "seoTitleEn",
  "seoDescriptionEn",
] as const;

const TIMELINE_TRANSLATABLE = ["titleEn", "descriptionEn"] as const;

function toEventData(values: EventFormValues) {
  return blankToNull(
    {
      title: values.title,
      slug: values.slug,
      subtitle: values.subtitle || null,
      description: values.description,
      coverImage: values.coverImage || null,
      date: new Date(values.date),
      startTime: values.startTime,
      endTime: values.endTime || null,
      location: values.location,
      speakerName: values.speakerName || null,
      speakerBio: values.speakerBio || null,
      capacity: values.capacity === "" || values.capacity === undefined ? null : values.capacity,
      status: values.status,
      titleEn: values.titleEn,
      subtitleEn: values.subtitleEn,
      descriptionEn: values.descriptionEn,
      locationEn: values.locationEn,
      speakerNameEn: values.speakerNameEn,
      speakerBioEn: values.speakerBioEn,
      seoTitleEn: values.seoTitleEn,
      seoDescriptionEn: values.seoDescriptionEn,
    },
    TRANSLATABLE,
  );
}

/**
 * Timeline rows are recreated from scratch on every save, so the English
 * columns go through the same blank-to-NULL normalization as the event itself.
 */
function toTimelineData(timeline: EventFormValues["timeline"]) {
  return timeline.map((item, index) => ({
    ...blankToNull(
      {
        time: item.time,
        title: item.title,
        description: item.description || null,
        titleEn: item.titleEn,
        descriptionEn: item.descriptionEn,
      },
      TIMELINE_TRANSLATABLE,
    ),
    sortOrder: index,
  }));
}

export async function createEvent(values: EventFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    const existing = await prisma.event.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return { success: false, error: "این نامک قبلاً استفاده شده است." };
    }

    const event = await prisma.event.create({
      data: {
        ...toEventData(parsed.data),
        timeline: {
          create: toTimelineData(parsed.data.timeline),
        },
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");
    redirect(`/admin/events/${event.id}`);
  } catch {
    return { success: false, error: "ثبت رویداد با خطا مواجه شد." };
  }
}

export async function updateEvent(
  eventId: string,
  values: EventFormValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = eventFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    const existing = await prisma.event.findFirst({
      where: { slug: parsed.data.slug, NOT: { id: eventId } },
    });
    if (existing) {
      return { success: false, error: "این نامک قبلاً استفاده شده است." };
    }

    await prisma.$transaction([
      prisma.eventTimelineItem.deleteMany({ where: { eventId } }),
      prisma.event.update({
        where: { id: eventId },
        data: {
          ...toEventData(parsed.data),
          timeline: {
            create: toTimelineData(parsed.data.timeline),
          },
        },
      }),
    ]);

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath("/events");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی رویداد با خطا مواجه شد." };
  }
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "حذف رویداد با خطا مواجه شد." };
  }
}
