import "server-only";

import { SITE_URL } from "@/lib/constants";
import { formatEventDate } from "@/utils/formatDate";

/**
 * Minimal FarazSMS (a.k.a. IranPayamak) client. Docs: https://docs.farazsms.com
 *
 * PishTalk only ever sends one kind of message (the registration-approval
 * notice) to one recipient at a time, so this wraps the plain "send simple
 * SMS" REST endpoint directly with `fetch` instead of pulling in an SDK.
 *
 * Note on delivery speed: FarazSMS shared lines route text sent without a
 * pre-approved pattern through human moderation, which can take 5-10
 * minutes. A dedicated line number (FARAZSMS_LINE_NUMBER below) delivers
 * immediately. If PishTalk is on a shared line and near-instant delivery
 * matters, switch to FarazSMS's pattern-based send endpoint instead — that
 * requires creating and getting a pattern approved once in the FarazSMS
 * panel, which is more setup than this file currently does.
 */

const FARAZSMS_API_URL = "https://api.iranpayamak.com/ws/v1/sms/simple";

export interface SendSmsResult {
  readonly success: boolean;
  readonly error?: string;
}

/**
 * Sends a plain-text SMS to a single Iranian mobile number (09xxxxxxxxx).
 *
 * Missing FARAZSMS_API_KEY / FARAZSMS_LINE_NUMBER is treated as a soft
 * failure — logged and returned as `{ success: false }` — rather than
 * thrown, so a misconfigured deploy can't crash the admin's approve
 * action. The admin panel surfaces the failure via smsSentAt staying null
 * and offers a retry once the env vars are set.
 */
export async function sendSms(phone: string, text: string): Promise<SendSmsResult> {
  const apiKey = process.env.FARAZSMS_API_KEY;
  const lineNumber = process.env.FARAZSMS_LINE_NUMBER;

  if (!apiKey || !lineNumber) {
    console.error("sendSms: FARAZSMS_API_KEY / FARAZSMS_LINE_NUMBER is not configured");
    return { success: false, error: "ارسال پیامک تنظیم نشده است." };
  }

  try {
    const response = await fetch(FARAZSMS_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        line_number: lineNumber,
        recipients: [phone],
        number_format: "english",
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`sendSms: FarazSMS responded ${response.status}: ${body}`);
      return { success: false, error: "ارسال پیامک با خطا مواجه شد." };
    }

    return { success: true };
  } catch (err) {
    console.error("sendSms: request to FarazSMS failed:", err);
    return { success: false, error: "ارسال پیامک با خطا مواجه شد." };
  }
}

/**
 * Builds the Persian approval-notice text sent once an admin approves a
 * registration. Keeps the message itself short (SMS length costs money in
 * segments) and puts the full event details behind the link instead of
 * cramming them into the text.
 */
export function buildApprovalSmsText(
  event: { title: string; date: Date; startTime: string; location: string },
  approvalToken: string,
): string {
  const dateLabel = formatEventDate(event.date, "fa");
  const link = `${SITE_URL}/registration-status/${approvalToken}`;

  return (
    `پیشتاک: ثبت‌نام شما در «${event.title}» تأیید شد.\n` +
    `${dateLabel} - ساعت ${event.startTime}\n` +
    `مکان: ${event.location}\n` +
    `جزئیات: ${link}`
  );
}
