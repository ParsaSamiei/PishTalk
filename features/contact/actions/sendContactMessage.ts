"use server";

import { prisma } from "@/lib/prisma";
import { contactFormSchema, type ContactFormValues } from "@/features/contact/types/contact";

export interface SendContactMessageResult {
  readonly success: boolean;
  readonly error?: string;
}

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
  values: ContactFormValues
): Promise<SendContactMessageResult> {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    return { success: true };
  } catch {
    return {
      success: false,
      error: "ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
    };
  }
}
