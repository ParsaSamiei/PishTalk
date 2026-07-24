"use server";

import { prisma } from "@/lib/prisma";
import {
  registrationFormSchema,
  type RegistrationFormValues,
} from "@/features/registration/types/registration";

export interface CreateRegistrationResult {
  readonly success: boolean;
  readonly error?: string;
}

/**
 * Registers a visitor for a specific event. Capacity is checked against
 * the event's `capacity` field (null = unlimited), and duplicate phone
 * numbers for the same event are rejected so people cannot double-book.
 */
export async function createRegistration(
  eventId: string,
  values: RegistrationFormValues
): Promise<CreateRegistrationResult> {
  const parsed = registrationFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { capacity: true, status: true, deletedAt: true },
    });

    if (!event || event.deletedAt || event.status !== "PUBLISHED") {
      return { success: false, error: "این رویداد برای ثبت‌نام در دسترس نیست." };
    }

    if (event.capacity !== null) {
      const registeredCount = await prisma.registration.count({
        where: { eventId, status: "REGISTERED" },
      });

      if (registeredCount >= event.capacity) {
        return { success: false, error: "ظرفیت این رویداد تکمیل شده است." };
      }
    }

    const existing = await prisma.registration.findFirst({
      where: { eventId, phone: parsed.data.phone, status: "REGISTERED" },
    });

    if (existing) {
      return { success: false, error: "این شماره موبایل قبلاً برای این رویداد ثبت‌نام کرده است." };
    }

    await prisma.registration.create({
      data: {
        eventId,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        university: parsed.data.university || null,
        company: parsed.data.company || null,
        profession: parsed.data.profession || null,
        notes: parsed.data.notes || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "ثبت‌نام با خطا مواجه شد. لطفاً دوباره تلاش کنید." };
  }
}
