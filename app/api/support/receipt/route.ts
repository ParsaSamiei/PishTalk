import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getSupportPaymentInfo } from "@/lib/support";
import { deleteReceiptImage, saveReceiptImage } from "@/lib/receipt-storage";
import {
  createReceiptFormSchema,
  RECEIPT_MAX_BYTES,
} from "@/features/support/types/receipt";

/**
 * Public, unauthenticated endpoint: a visitor who transferred money to the
 * institute uploads a photo of their bank receipt.
 *
 * This is the only endpoint on the site that accepts a file from someone who
 * is not logged in (there is no public login at all), so the controls below
 * are the whole defence. They run in a deliberate order — cheapest and most
 * decisive first, so an abusive request is rejected before it costs a body
 * read, an image decode, or a disk write.
 *
 * A Route Handler rather than a Server Action: actions cap request bodies at
 * 1MB by default, and raising `serverActions.bodySizeLimit` would relax that
 * globally for every action in the app, including the admin ones.
 *
 * No CSRF token: the endpoint borrows no ambient authority (no session, no
 * cookie is read for authorization), so a forged cross-site POST is
 * indistinguishable from a direct one. Rate limiting is the real control.
 */

// jimp and the @jsquash WASM decoder both need Node APIs.
export const runtime = "nodejs";

/**
 * Per-IP ceiling on requests of any kind, including rejected ones. Generous
 * on purpose: it exists to stop a flood from costing us body reads and image
 * decodes, not to ration submissions. A supporter who mistypes their phone
 * number and picks the wrong file twice must not be locked out.
 */
const ATTEMPT_LIMIT = 15;
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000;

/**
 * Per-IP ceiling on submissions that actually persist. Consumed only after
 * validation passes, so failed attempts never count against it.
 */
const SUBMIT_LIMIT = 3;
const SUBMIT_WINDOW_MS = 60 * 60 * 1000;

/**
 * Ceiling across all callers on submissions that write to disk. The per-IP
 * limit alone does not bound disk growth when addresses are cheap. Counts
 * writes rather than attempts, so a single client sending garbage cannot
 * exhaust it and lock out everyone else.
 */
const GLOBAL_LIMIT = 60;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;

/** Multipart boundaries and the text fields add overhead beyond the image. */
const MAX_BODY_BYTES = RECEIPT_MAX_BYTES + 512 * 1024;

function tooManyRequests(message: string, retryAfterSeconds: number) {
  return NextResponse.json(
    { error: message },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}

export async function POST(request: NextRequest) {
  const d = await getDictionary();

  // 1. Feature gate, re-read from the database. The toggle in site settings
  //    must never be enforced only by whether the UI renders the form.
  const payment = await getSupportPaymentInfo();
  if (!payment) {
    return NextResponse.json({ error: d.errors.receiptDisabled }, { status: 403 });
  }

  // 2. Flood protection, before touching the body so a flood costs us nothing.
  const ip = getClientIp(request.headers);
  const attempt = checkRateLimit(`receipt:attempt:${ip}`, ATTEMPT_LIMIT, ATTEMPT_WINDOW_MS);
  if (!attempt.allowed) {
    return tooManyRequests(d.errors.rateLimited, attempt.retryAfterSeconds);
  }

  // 3. Reject oversized uploads from the header, before buffering the body.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: d.errors.uploadTooLarge }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: d.errors.invalidInput }, { status: 400 });
  }

  // 4. Honeypot: report success without persisting, so a bot gets no signal
  //    that it was detected and does not retry with the field cleared.
  if (String(formData.get("website") ?? "") !== "") {
    return NextResponse.json({ success: true });
  }

  const parsed = createReceiptFormSchema(d).safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    amountToman: String(formData.get("amountToman") ?? ""),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? d.errors.invalidInput },
      { status: 400 },
    );
  }

  const file = formData.get("receipt");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: d.validation.receiptRequired }, { status: 400 });
  }
  // Content-Length can be absent or forged; this is the authoritative check.
  if (file.size > RECEIPT_MAX_BYTES) {
    return NextResponse.json({ error: d.errors.uploadTooLarge }, { status: 413 });
  }

  // 5. Decode and re-encode. This both proves the bytes really are an image
  //    (file.type is never trusted) and strips EXIF — including the GPS
  //    coordinates a phone attaches to a photo of a document.
  let receiptFile: string;
  try {
    receiptFile = await saveReceiptImage(Buffer.from(await file.arrayBuffer()));
  } catch (err) {
    console.error("Receipt image processing failed:", err);
    return NextResponse.json({ error: d.validation.receiptFormat }, { status: 400 });
  }

  // 6. Only now, holding a receipt that is definitely going to be recorded,
  //    consume the submission budgets — so they count receipts rather than
  //    mistakes. The decode above is already covered by the attempt limit.
  //    Anything rejected here has a file on disk that must not be orphaned.
  const submit = checkRateLimit(`receipt:submit:${ip}`, SUBMIT_LIMIT, SUBMIT_WINDOW_MS);
  if (!submit.allowed) {
    await deleteReceiptImage(receiptFile);
    return tooManyRequests(d.errors.rateLimited, submit.retryAfterSeconds);
  }
  const global = checkRateLimit("receipt:global", GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
  if (!global.allowed) {
    await deleteReceiptImage(receiptFile);
    return tooManyRequests(d.errors.rateLimited, global.retryAfterSeconds);
  }

  try {
    await prisma.supportReceipt.create({
      data: {
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        amountToman: parsed.data.amountToman,
        receiptFile,
      },
    });
  } catch (err) {
    // The image is already on disk. Remove it rather than leaving a file no
    // row will ever reference — nothing would ever clean it up otherwise.
    await deleteReceiptImage(receiptFile);
    console.error("Receipt persist failed:", err);
    return NextResponse.json({ error: d.errors.receiptFailed }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
