"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { sponsorFormSchema, type SponsorFormValues } from "@/features/admin/types/sponsorForm";
import { blankToNull } from "@/features/admin/actions/normalize";
import type { ActionResult } from "@/features/admin/actions/eventActions";

// logo/url/description are all optional -- a supporter can be listed by
// name alone. Blank inputs are stored as NULL, not "".
const TRANSLATABLE = ["logo", "url", "description", "descriptionEn"] as const;

export async function createSponsor(values: SponsorFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = sponsorFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.sponsor.create({
      data: blankToNull(parsed.data, TRANSLATABLE),
    });
    revalidatePath("/admin/sponsors");
    revalidatePath("/support");
    return { success: true };
  } catch {
    return { success: false, error: "ثبت حامی با خطا مواجه شد." };
  }
}

export async function updateSponsor(
  id: string,
  values: SponsorFormValues,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = sponsorFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.sponsor.update({
      where: { id },
      data: blankToNull(parsed.data, TRANSLATABLE),
    });
    revalidatePath("/admin/sponsors");
    revalidatePath("/support");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی حامی با خطا مواجه شد." };
  }
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.sponsor.delete({ where: { id } });
    revalidatePath("/admin/sponsors");
    revalidatePath("/support");
    return { success: true };
  } catch {
    return { success: false, error: "حذف حامی با خطا مواجه شد." };
  }
}
