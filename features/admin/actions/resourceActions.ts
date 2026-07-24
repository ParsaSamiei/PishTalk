"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { resourceFormSchema, type ResourceFormValues } from "@/features/admin/types/resourceForm";
import type { ActionResult } from "@/features/admin/actions/eventActions";

function toResourceData(values: ResourceFormValues) {
  return {
    title: values.title,
    description: values.description || null,
    resourceType: values.resourceType,
    fileUrl: values.fileUrl || null,
    externalUrl: values.externalUrl || null,
    eventId: values.eventId || null,
  };
}

export async function createResource(values: ResourceFormValues): Promise<ActionResult> {
  await requireAdmin();
  const parsed = resourceFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    await prisma.resource.create({ data: toResourceData(parsed.data) });
    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "ثبت منبع با خطا مواجه شد." };
  }
}

export async function updateResource(
  id: string,
  values: ResourceFormValues
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = resourceFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    await prisma.resource.update({ where: { id }, data: toResourceData(parsed.data) });
    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی منبع با خطا مواجه شد." };
  }
}

export async function deleteResource(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.resource.update({ where: { id }, data: { deletedAt: new Date() } });
    revalidatePath("/admin/resources");
    revalidatePath("/resources");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "حذف منبع با خطا مواجه شد." };
  }
}
