import { NextRequest, NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Jimp } from "jimp";

import { requireAdmin } from "@/lib/requireAdmin";

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

  // Everything below was previously unguarded: any failure here (a corrupt
  // buffer Jimp can't decode, a permissions error on mkdir/write, a full
  // disk, ...) crashed the route handler with no JSON body at all. The
  // client's `await res.json()` in ImageUploadField then threw its own,
  // unrelated parse error on top, masking whatever actually went wrong and
  // leaving nothing in the server logs to diagnose it from.
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // UUID filename per docs/05_DATABASE.md — never trust uploaded filenames
    const filename = `${randomUUID()}.jpg`;
    const filepath = path.join(uploadDir, filename);

    const image = await Jimp.read(buffer);
    const { width, height } = image.bitmap;

    // Only downscale, never upscale a small source image
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      image.scaleToFit({ w: MAX_DIMENSION, h: MAX_DIMENSION });
    }
    await image.write(filepath as `${string}.jpg`, { quality: 82 });

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err) {
    console.error("Image upload failed:", err);
    return NextResponse.json(
      { error: "پردازش تصویر با خطا مواجه شد." },
      { status: 500 },
    );
  }
}
