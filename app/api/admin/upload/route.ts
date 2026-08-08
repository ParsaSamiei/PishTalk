import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/requireAdmin";
import { decodeImage } from "@/lib/decodeImage";

// 10MB per docs/05_DATABASE.md
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_FOLDERS = ["events", "blog", "gallery", "profile", "sponsors"] as const;
const MAX_DIMENSION = 1600;

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderInput = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "فایلی ارسال نشده است." },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "فرمت تصویر پشتیبانی نمی‌شود." },
      { status: 400 },
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد." },
      { status: 400 },
    );
  }

  // Never trust the folder value from the client beyond an allow-list
  const folder = (ALLOWED_FOLDERS as readonly string[]).includes(
    folderInput as string,
  )
    ? (folderInput as (typeof ALLOWED_FOLDERS)[number])
    : "misc";

  // Decoding and disk I/O are deliberately in separate try blocks with
  // distinct messages. They were previously one block behind a single generic
  // "پردازش تصویر با خطا مواجه شد.", which is what made this bug so hard to
  // place: an undecodable upload and a permissions error on the uploads
  // volume produced the identical string, so the message told you nothing
  // about which half had failed. Keep them apart.
  const buffer = Buffer.from(await file.arrayBuffer());

  let jpeg: Buffer;
  try {
    // decodeImage routes webp through a WASM libwebp build; everything else
    // goes straight to Jimp. See lib/decodeImage.ts for why not sharp.
    const image = await decodeImage(buffer);
    const { width, height } = image.bitmap;

    // Only downscale, never upscale a small source image
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
    }
    jpeg = await image.getBuffer("image/jpeg", { quality: 82 });
  } catch (err) {
    console.error("Image decode failed:", err);
    return NextResponse.json(
      { error: "فایل تصویر معتبر نیست یا آسیب دیده است." },
      { status: 400 },
    );
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // UUID filename per docs/05_DATABASE.md — never trust uploaded filenames
    const filename = `${randomUUID()}.jpg`;
    await writeFile(path.join(uploadDir, filename), jpeg);

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err) {
    // Log the errno explicitly: EACCES here means the uploads volume is not
    // writable by the runtime user, which is a deployment problem rather than
    // anything to do with the file that was uploaded.
    console.error(
      "Image write failed:",
      (err as NodeJS.ErrnoException)?.code ?? "",
      err,
    );
    return NextResponse.json(
      { error: "ذخیره تصویر روی سرور ممکن نشد." },
      { status: 500 },
    );
  }
}
