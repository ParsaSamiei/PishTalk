import { prisma } from "@/lib/prisma";
import type { EventDetail, EventSummary } from "@/features/events/types/event";

function toSummary(event: {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  coverImage: string | null;
  date: Date;
  startTime: string;
  location: string;
  status: string;
}): EventSummary {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    coverImage: event.coverImage,
    date: event.date,
    startTime: event.startTime,
    location: event.location,
    status: event.status as EventSummary["status"],
  };
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
      endTime: event.endTime,
      speakerName: event.speakerName,
      speakerBio: event.speakerBio,
      timeline: event.timeline.map((item) => ({
        id: item.id,
        time: item.time,
        title: item.title,
        description: item.description,
        sortOrder: item.sortOrder,
      })),
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
      endTime: event.endTime,
      speakerName: event.speakerName,
      speakerBio: event.speakerBio,
      timeline: event.timeline.map((item) => ({
        id: item.id,
        time: item.time,
        title: item.title,
        description: item.description,
        sortOrder: item.sortOrder,
      })),
    };
  } catch {
    return null;
  }
}
