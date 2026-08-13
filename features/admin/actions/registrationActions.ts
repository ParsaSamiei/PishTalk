"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { sendSms, buildApprovalSmsText } from "@/lib/sms";
import { getSiteSettings } from "@/lib/site-settings";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export async function deleteRegistration(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.registration.delete({ where: { id } });
    revalidatePath("/admin/registrations");
    return { success: true };
  } catch {
    return { success: false, error: "حذف ثبت‌نام با خطا مواجه شد." };
  }
}

export interface ReviewRegistrationValues {
  readonly id: string;
  readonly status: "APPROVED" | "REJECTED";
  readonly adminNote?: string;
}

export interface ReviewRegistrationResult extends ActionResult {
  /** Set when the approval itself succeeded but the SMS send did not. */
  readonly warning?: string;
  /** Set when smsApprovalEnabled was off, so no send was attempted at all. */
  readonly smsSkipped?: boolean;
}

/**
 * Approves or rejects a pending registration after an admin reviews the
 * visitor's notes.
 *
 * If Site Settings > smsApprovalEnabled is on (the default), approving
 * sends a FarazSMS notice with a link to
 * /registration-status/[approvalToken] showing the event's date, time, and
 * location — see lib/sms.ts. If it's off, the approval still happens and
 * the token still exists; the admin just gets the link back to copy and
 * send themselves (RegistrationReviewActions renders a copy-link button
 * for any APPROVED row with no smsSentAt, whether that's because the
 * toggle was off or because a send attempt failed).
 *
 * The SMS is sent *after* the status is committed, and a send failure does
 * not roll the approval back: the registration is genuinely approved
 * either way. `smsSentAt` staying null is how the admin panel knows to
 * offer "resend SMS" (resendApprovalSms below) instead of the visitor
 * being silently left without their notice.
 */
export async function reviewRegistration(
  values: ReviewRegistrationValues,
): Promise<ReviewRegistrationResult> {
  const session = await requireAdmin();

  try {
    const registration = await prisma.registration.update({
      where: { id: values.id },
      data: {
        status: values.status,
        adminNote: values.adminNote || null,
        reviewedAt: new Date(),
        reviewedById: session.user?.id ?? null,
      },
      include: { event: true },
    });

    revalidatePath("/admin/registrations");

    if (values.status !== "APPROVED") {
      return { success: true };
    }

    const { smsApprovalEnabled } = await getSiteSettings();
    if (!smsApprovalEnabled) {
      return { success: true, smsSkipped: true };
    }

    const smsText = buildApprovalSmsText(registration.event, registration.approvalToken);
    const smsResult = await sendSms(registration.phone, smsText);

    if (!smsResult.success) {
      return {
        success: true,
        warning:
          "ثبت‌نام تأیید شد، ولی ارسال پیامک با خطا مواجه شد. لینک را کپی کنید یا دوباره تلاش کنید.",
      };
    }

    await prisma.registration.update({
      where: { id: registration.id },
      data: { smsSentAt: new Date() },
    });
    revalidatePath("/admin/registrations");

    return { success: true };
  } catch (err) {
    console.error("reviewRegistration failed:", err);
    return { success: false, error: "ثبت وضعیت ثبت‌نام با خطا مواجه شد." };
  }
}

/**
 * Sends (or retries) the approval SMS for a registration that is already
 * APPROVED — used when the automatic send failed, when smsApprovalEnabled
 * was off at approval time and the admin changes their mind, or when a
 * visitor says they never received it. Always attempts the send regardless
 * of the current smsApprovalEnabled setting: reaching for this button is
 * itself an explicit, one-off decision to send, distinct from the
 * approve-time default.
 */
export async function resendApprovalSms(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!registration || registration.status !== "APPROVED") {
      return { success: false, error: "این ثبت‌نام تأییدشده نیست." };
    }

    const smsText = buildApprovalSmsText(registration.event, registration.approvalToken);
    const smsResult = await sendSms(registration.phone, smsText);

    if (!smsResult.success) {
      return { success: false, error: smsResult.error ?? "ارسال پیامک با خطا مواجه شد." };
    }

    await prisma.registration.update({
      where: { id },
      data: { smsSentAt: new Date() },
    });
    revalidatePath("/admin/registrations");

    return { success: true };
  } catch (err) {
    console.error("resendApprovalSms failed:", err);
    return { success: false, error: "ارسال پیامک با خطا مواجه شد." };
  }
}
