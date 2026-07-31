import { prisma } from "@/lib/prisma";
import type { EventDetail, EventSummary } from "@/features/events/types/event";

function toSummary(event: {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  subtitle: string | null;
  subtitleEn: string | null;
  coverImage: string | null;
  date: Date;
  startTime: string;
  location: string;
  locationEn: string | null;
  status: string;
}): EventSummary {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    titleEn: event.titleEn,
    subtitle: event.subtitle,
    subtitleEn: event.subtitleEn,
    coverImage: event.coverImage,
    date: event.date,
    startTime: event.startTime,
    location: event.location,
    locationEn: event.locationEn,
    status: event.status as EventSummary["status"],
  };
}

/** Shared mapper for an event's schedule rows, Persian plus English. */
function toTimeline(
  timeline: ReadonlyArray<{
    id: string;
    time: string;
    title: string;
    titleEn: string | null;
    description: string | null;
    descriptionEn: string | null;
    sortOrder: number;
  }>,
) {
  return timeline.map((item) => ({
    id: item.id,
    time: item.time,
    title: item.title,
    titleEn: item.titleEn,
    description: item.description,
    descriptionEn: item.descriptionEn,
    sortOrder: item.sortOrder,
  }));
}

/**
 * The next upcoming published event, used by the homepage Hero and
 * Next Event sections. Returns null when nothing is scheduled yet.
 */
export async function getNextEvent(): Promise<EventDetail | null> {
  try {
    const event = await prisma.event.findFirst({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        date: { gte: new Date(new Date().toDateString()) },
      },
      orderBy: { date: "asc" },
      include: { timeline: { orderBy: { sortOrder: "asc" } } },
    });

    if (!event) return null;

    return {
      ...toSummary(event),
      description: event.description,
      descriptionEn: event.descriptionEn,
      endTime: event.endTime,
      speakerName: event.speakerName,
      speakerNameEn: event.speakerNameEn,
      speakerBio: event.speakerBio,
      speakerBioEn: event.speakerBioEn,
      timeline: toTimeline(event.timeline),
    };
  } catch {
    return null;
  }
}

/**
 * Every upcoming published event, soonest first. Used by the /events
 * listing so a second published future event isn't silently dropped
 * (getNextEvent only ever returns the single soonest one).
 */
export async function getUpcomingEvents(limit = 50, search?: string): Promise<EventSummary[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        date: { gte: new Date(new Date().toDateString()) },
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { date: "asc" },
      take: limit,
    });

    return events.map(toSummary);
  } catch {
    return [];
  }
}

/**
 * Past published events, newest first, for the "Previous Events" section
 * and the /events archive.
 */
export async function getPastEvents(limit = 6, search?: string): Promise<EventSummary[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: { in: ["PUBLISHED", "ARCHIVED"] },
        deletedAt: null,
        date: { lt: new Date(new Date().toDateString()) },
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { date: "desc" },
      take: limit,
    });

    return events.map(toSummary);
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  try {
    const event = await prisma.event.findFirst({
      where: { slug, deletedAt: null },
      include: { timeline: { orderBy: { sortOrder: "asc" } } },
    });

    if (!event) return null;

    return {
      ...toSummary(event),
      description: event.description,
      descriptionEn: event.descriptionEn,
      endTime: event.endTime,
      speakerName: event.speakerName,
      speakerNameEn: event.speakerNameEn,
      speakerBio: event.speakerBio,
      speakerBioEn: event.speakerBioEn,
      timeline: toTimeline(event.timeline),
    };
  } catch {
    return null;
  }
}
