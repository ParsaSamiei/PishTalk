"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  profileFormSchema,
  passwordFormSchema,
  type ProfileFormValues,
  type PasswordFormValues,
} from "@/features/admin/types/profileForm";
import type { ActionResult } from "@/features/admin/actions/eventActions";

export async function updateProfile(values: ProfileFormValues): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = profileFormSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: "اطلاعات وارد شده معتبر نیست." };

  try {
    await prisma.admin.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name },
    });
    revalidatePath("/admin/profile");
    return { success: true };
  } catch {
    return { success: false, error: "به‌روزرسانی پروفایل با خطا مواجه شد." };
  }
}

export async function changePassword(values: PasswordFormValues): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = passwordFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "اطلاعات وارد شده معتبر نیست." };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
    if (!admin) return { success: false, error: "کاربر یافت نشد." };

    const isValid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
    if (!isValid) return { success: false, error: "رمز عبور فعلی اشتباه است." };

    const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: newHash } });

    return { success: true };
  } catch {
    return { success: false, error: "تغییر رمز عبور با خطا مواجه شد." };
  }
}
