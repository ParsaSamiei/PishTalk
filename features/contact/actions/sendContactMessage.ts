"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/features/contact/types/contact";

export interface SendContactMessageResult {
  readonly success: boolean;
  readonly error?: string;
}

const SUBMIT_LIMIT = 5;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

/**
 * Validates and stores a contact form submission.
 *
 * Assumption: docs/05_DATABASE.md does not define a table for contact
 * messages (only Registrations persist visitor-submitted data). A minimal
 * `ContactMessage` model was added to prisma/schema.prisma so submissions
 * are never lost; wire up an email/Slack notification on top of this once
 * a provider is chosen.
 */
export async function sendContactMessage(
  values: ContactFormValues,
): Promise<SendContactMessageResult> {
  const ip = getClientIp(await headers());
  const rateLimit = checkRateLimit(`contact:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!rateLimit.allowed) {
    return { success: false, error: "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید." };
  }

  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      },
    });
    return { success: true };
  } catch {
    return {
      success: false,
      error: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
    };
  }
}
