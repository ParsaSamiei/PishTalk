"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getDictionary } from "@/lib/i18n/server";
import {
  createLookupRegistrationsSchema,
  type LookupRegistrationsValues,
  type RegistrationLookupItem,
} from "@/features/registration/types/lookupRegistrations";

export interface LookupRegistrationsResult {
  readonly success: boolean;
  readonly error?: string;
  readonly registrations?: RegistrationLookupItem[];
}

const LOOKUP_LIMIT = 10;
const LOOKUP_WINDOW_MS = 60 * 60 * 1000;

/**
 * Lets a visitor confirm which events they've registered for — and whether
 * each was cancelled or marked attended by an admin at check-in — without
 * requiring an account.
 *
 * There's no user login in this app (see prisma/schema.prisma: only `Admin`
 * has credentials), so this is a lookup, not real authentication. Matching
 * on phone number alone would let anyone enumerate another visitor's
 * registrations just by guessing digits, so the last name given at
 * registration is required as a second field. It's a deterrent against
 * casual lookups, not a security boundary — rate limiting is the other half
 * of that deterrent.
 */
export async function lookupRegistrations(
  values: LookupRegistrationsValues
): Promise<LookupRegistrationsResult> {
  const d = await getDictionary();
  const ip = getClientIp(await headers());
  const rateLimit = checkRateLimit(`registration-lookup:${ip}`, LOOKUP_LIMIT, LOOKUP_WINDOW_MS);
  if (!rateLimit.allowed) {
    return { success: false, error: d.errors.rateLimited };
  }

  const parsed = createLookupRegistrationsSchema(d).safeParse(values);

  if (!parsed.success) {
    return { success: false, error: d.errors.invalidInput };
  }

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        phone: parsed.data.phone,
        lastName: { equals: parsed.data.lastName, mode: "insensitive" },
        event: { deletedAt: null },
      },
      include: {
        event: {
          select: {
            slug: true,
            title: true,
            titleEn: true,
            date: true,
            startTime: true,
            location: true,
            locationEn: true,
            coverImage: true,
          },
        },
      },
      orderBy: { event: { date: "desc" } },
    });

    return {
      success: true,
      registrations: registrations.map(
        (registration): RegistrationLookupItem => ({
          id: registration.id,
          status: registration.status,
          createdAt: registration.createdAt.toISOString(),
          event: {
            slug: registration.event.slug,
            title: registration.event.title,
            titleEn: registration.event.titleEn,
            date: registration.event.date.toISOString(),
            startTime: registration.event.startTime,
            location: registration.event.location,
            locationEn: registration.event.locationEn,
            coverImage: registration.event.coverImage,
          },
        })
      ),
    };
  } catch {
    return { success: false, error: d.errors.generic };
  }
}
