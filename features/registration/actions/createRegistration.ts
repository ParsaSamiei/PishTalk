"use server";

import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getDictionary } from "@/lib/i18n/server";
import {
  createRegistrationFormSchema,
  type RegistrationFormValues,
} from "@/features/registration/types/registration";

export type CreateRegistrationErrorCode =
  | "RATE_LIMITED"
  | "INVALID_INPUT"
  | "EVENT_UNAVAILABLE"
  | "CAPACITY_FULL"
  | "DUPLICATE_PHONE"
  | "REGISTRATION_FAILED";

export interface CreateRegistrationResult {
  readonly success: boolean;
  readonly error?: string;
  // Stable, locale-independent reason for `error`, so callers (e.g.
  // analytics) don't have to key off the translated message text.
  readonly errorCode?: CreateRegistrationErrorCode;
}

const SUBMIT_LIMIT = 5;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

/**
 * Registers a visitor for a specific event. Capacity is checked against
 * the event's `capacity` field (null = unlimited), and duplicate phone
 * numbers for the same event are rejected so people cannot double-book.
 */
export async function createRegistration(
  eventId: string,
  values: RegistrationFormValues
): Promise<CreateRegistrationResult> {
  const d = await getDictionary();
  const ip = getClientIp(await headers());
  const rateLimit = checkRateLimit(`registration:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!rateLimit.allowed) {
    return { success: false, error: d.errors.rateLimited, errorCode: "RATE_LIMITED" };
  }

  // Re-validated server-side with the request's locale: the client's own
  // validation is a convenience, never a guarantee.
  const parsed = createRegistrationFormSchema(d).safeParse(values);

  if (!parsed.success) {
    return { success: false, error: d.errors.invalidInput, errorCode: "INVALID_INPUT" };
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { capacity: true, status: true, deletedAt: true },
    });

    if (!event || event.deletedAt || event.status !== "PUBLISHED") {
      return { success: false, error: d.errors.eventUnavailable, errorCode: "EVENT_UNAVAILABLE" };
    }

    // The capacity check, duplicate-phone check, and insert all run inside
    // one Serializable transaction so two concurrent submissions near
    // capacity can't both read "one spot left" and both insert — Postgres
    // will abort one of them with a serialization failure instead, which we
    // surface as a normal "please try again" error.
    await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Counts PENDING alongside APPROVED: a capacity-limited event must
        // reserve the spot as soon as someone submits, or two concurrent
        // submissions right at the last spot could both go PENDING and
        // both later be approved past capacity.
        const activeStatuses: Prisma.RegistrationWhereInput["status"] = {
          in: ["PENDING", "APPROVED"],
        };

        if (event.capacity !== null) {
          const registeredCount = await tx.registration.count({
            where: { eventId, status: activeStatuses },
          });

          if (registeredCount >= event.capacity) {
            throw new Error("CAPACITY_FULL");
          }
        }

        const existing = await tx.registration.findFirst({
          where: { eventId, phone: parsed.data.phone, status: activeStatuses },
        });

        if (existing) {
          throw new Error("DUPLICATE_PHONE");
        }

        await tx.registration.create({
          data: {
            eventId,
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            certificateName: parsed.data.certificateName || null,
            phone: parsed.data.phone,
            email: parsed.data.email || null,
            university: parsed.data.university || null,
            company: parsed.data.company || null,
            profession: parsed.data.profession || null,
            notes: parsed.data.notes || null,
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "CAPACITY_FULL") {
      return { success: false, error: d.errors.eventFull, errorCode: "CAPACITY_FULL" };
    }
    if (error instanceof Error && error.message === "DUPLICATE_PHONE") {
      return { success: false, error: d.errors.duplicatePhone, errorCode: "DUPLICATE_PHONE" };
    }
    // Includes Prisma's P2034 serialization-failure code, raised when the
    // transaction above loses a race with another concurrent submission.
    return { success: false, error: d.errors.registrationFailed, errorCode: "REGISTRATION_FAILED" };
  }
}
