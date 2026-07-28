"use server";

import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
} from "@/features/admin/types/siteSettingsForm";
import type { ActionResult } from "@/features/admin/actions/eventActions";

/**
 * `googleMapsEmbed` is rendered with `dangerouslySetInnerHTML` in the
 * site-wide Footer and on the contact page, so — exactly like blog content —
 * it must be sanitized here rather than trusted as-is, regardless of which
 * UI produced it. A real Google Maps embed is just an <iframe>, so only
 * that tag and the attributes it actually uses are allowed; anything else
 * (script tags, event handlers, etc.) is stripped.
 */
function sanitizeMapsEmbed(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["iframe"],
    ALLOWED_ATTR: ["src", "width", "height", "style", "allowfullscreen", "loading", "referrerpolicy", "title"],
  });
}

export async function updateSiteSettings(values: SiteSettingsFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = siteSettingsFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  const data = {
    siteName: parsed.data.siteName,
    tagline: parsed.data.tagline,
    description: parsed.data.description || null,
    logo: parsed.data.logo || null,
    favicon: parsed.data.favicon || null,
    heroTitle: parsed.data.heroTitle || null,
    heroSubtitle: parsed.data.heroSubtitle || null,
    contactEmail: parsed.data.contactEmail || null,
    phone: parsed.data.phone || null,
    phone2: parsed.data.phone2 || null,
    address: parsed.data.address || null,
    instagram: parsed.data.instagram || null,
    telegram: parsed.data.telegram || null,
    pishnamUrl: parsed.data.pishnamUrl || null,
    googleMapsEmbed: parsed.data.googleMapsEmbed
      ? sanitizeMapsEmbed(parsed.data.googleMapsEmbed)
      : null,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    defaultOgImage: parsed.data.defaultOgImage || null,
    googleAnalyticsId: parsed.data.googleAnalyticsId || null,
    maintenanceMode: parsed.data.maintenanceMode,
  };

  try {
    const existing = await prisma.siteSettings.findFirst();

    if (existing) {
      await prisma.siteSettings.update({ where: { id: existing.id }, data });
    } else {
      await prisma.siteSettings.create({ data });
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی تنظیمات با خطا مواجه شد." };
  }
}
