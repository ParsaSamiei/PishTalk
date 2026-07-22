"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  profileFormSchema,
  passwordFormSchema,
  type ProfileFormValues,
  type PasswordFormValues,
} from "@/features/admin/types/profileForm";
import { updateProfile, changePassword } from "@/features/admin/actions/profileActions";
import { useToast } from "@/providers/ToastProvider";

interface ProfileFormProps {
  readonly name: string;
  readonly email: string;
}

function ProfileForm({ name, email }: ProfileFormProps) {
  const { showToast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
  });

  async function onProfileSubmit(values: ProfileFormValues) {
    const result = await updateProfile(values);
    if (result.success) {
      showToast("پروفایل به‌روزرسانی شد", { variant: "success" });
    } else {
      showToast("به‌روزرسانی ناموفق بود", { variant: "danger", description: result.error });
    }
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    const result = await changePassword(values);
    if (result.success) {
      showToast("رمز عبور تغییر کرد", { variant: "success" });
      passwordForm.reset();
    } else {
      showToast("تغییر رمز عبور ناموفق بود", { variant: "danger", description: result.error });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">اطلاعات حساب</h2>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" value={email} dir="ltr" disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">نام</Label>
            <Input id="name" {...profileForm.register("name")} />
            {profileForm.formState.errors.name ? (
              <p className="text-sm text-danger">{profileForm.formState.errors.name.message}</p>
            ) : null}
          </div>
          <Button type="submit" isLoading={profileForm.formState.isSubmitting} className="self-start">
            ذخیره تغییرات
          </Button>
        </form>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">تغییر رمز عبور</h2>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
            <Input
              id="currentPassword"
              type="password"
              dir="ltr"
              {...passwordForm.register("currentPassword")}
            />
            {passwordForm.formState.errors.currentPassword ? (
              <p className="text-sm text-danger">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">رمز عبور جدید</Label>
              <Input
                id="newPassword"
                type="password"
                dir="ltr"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword ? (
                <p className="text-sm text-danger">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
              <Input
                id="confirmPassword"
                type="password"
                dir="ltr"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword ? (
                <p className="text-sm text-danger">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            isLoading={passwordForm.formState.isSubmitting}
            className="self-start"
          >
            تغییر رمز عبور
          </Button>
        </form>
      </Card>
    </div>
  );
}

export { ProfileForm };
