"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  siteSettingsFormSchema,
  type SiteSettingsFormValues,
  type SiteSettingsFormInput,
} from "@/features/admin/types/siteSettingsForm";
import { updateSiteSettings } from "@/features/admin/actions/siteSettingsActions";
import { useToast } from "@/providers/ToastProvider";

interface SiteSettingsFormProps {
  readonly defaultValues: SiteSettingsFormValues;
}

function SiteSettingsForm({ defaultValues }: SiteSettingsFormProps) {
  const { showToast } = useToast();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormInput, unknown, SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues: defaultValues as SiteSettingsFormInput,
  });

  async function onSubmit(values: SiteSettingsFormValues) {
    setServerError(null);
    const result = await updateSiteSettings(values);
    if (result.success) {
      showToast("تنظیمات ذخیره شد", { variant: "success" });
    } else {
      setServerError(result.error ?? "خطایی رخ داد.");
      showToast("ذخیره تنظیمات ناموفق بود", { variant: "danger", description: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">اطلاعات عمومی</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="siteName">نام سایت</Label>
            <Input id="siteName" {...register("siteName")} />
            {errors.siteName ? (
              <p className="text-sm text-danger">{errors.siteName.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tagline">شعار سایت</Label>
            <Input id="tagline" {...register("tagline")} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">توضیحات (برای سئو)</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="logo">آدرس لوگو (اختیاری)</Label>
            <Input id="logo" dir="ltr" {...register("logo")} />
            {errors.logo ? <p className="text-sm text-danger">{errors.logo.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="favicon">آدرس فاوآیکون (اختیاری)</Label>
            <Input id="favicon" dir="ltr" {...register("favicon")} />
            {errors.favicon ? (
              <p className="text-sm text-danger">{errors.favicon.message}</p>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">هدر صفحه اصلی</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroTitle">عنوان (اختیاری — پیش‌فرض کد استفاده می‌شود)</Label>
          <Input id="heroTitle" {...register("heroTitle")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="heroSubtitle">زیرعنوان (اختیاری)</Label>
          <Textarea id="heroSubtitle" rows={2} {...register("heroSubtitle")} />
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">اطلاعات تماس</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contactEmail">ایمیل</Label>
            <Input id="contactEmail" dir="ltr" {...register("contactEmail")} />
            {errors.contactEmail ? (
              <p className="text-sm text-danger">{errors.contactEmail.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">تلفن</Label>
            <Input id="phone" dir="ltr" {...register("phone")} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">آدرس</Label>
          <Input id="address" {...register("address")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="googleMapsEmbed">کد embed نقشه گوگل (اختیاری)</Label>
          <Textarea
            id="googleMapsEmbed"
            rows={2}
            dir="ltr"
            className="font-mono text-xs"
            placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
            {...register("googleMapsEmbed")}
          />
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">شبکه‌های اجتماعی و لینک‌ها</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="instagram">اینستاگرام</Label>
            <Input id="instagram" dir="ltr" {...register("instagram")} />
            {errors.instagram ? (
              <p className="text-sm text-danger">{errors.instagram.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="telegram">تلگرام</Label>
            <Input id="telegram" dir="ltr" {...register("telegram")} />
            {errors.telegram ? (
              <p className="text-sm text-danger">{errors.telegram.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pishnamUrl">وب‌سایت پیشنام</Label>
            <Input id="pishnamUrl" dir="ltr" {...register("pishnamUrl")} />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">سئو پیش‌فرض</h2>
        <p className="text-xs text-text-light">
          این مقادیر وقتی استفاده می‌شوند که یک صفحه عنوان/توضیحات سئوی اختصاصی نداشته باشد.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="seoTitle">عنوان پیش‌فرض سئو</Label>
          <Input id="seoTitle" {...register("seoTitle")} />
          {errors.seoTitle ? (
            <p className="text-sm text-danger">{errors.seoTitle.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="seoDescription">توضیحات پیش‌فرض سئو</Label>
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} />
          {errors.seoDescription ? (
            <p className="text-sm text-danger">{errors.seoDescription.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="defaultOgImage">تصویر پیش‌فرض OG (اختیاری)</Label>
          <Input id="defaultOgImage" dir="ltr" {...register("defaultOgImage")} />
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">آنالیتیکس و نگهداری</h2>
        <div className="flex flex-col gap-2">
          <Label htmlFor="googleAnalyticsId">شناسه Google Analytics (اختیاری)</Label>
          <Input id="googleAnalyticsId" dir="ltr" placeholder="G-XXXXXXX" {...register("googleAnalyticsId")} />
          {errors.googleAnalyticsId ? (
            <p className="text-sm text-danger">{errors.googleAnalyticsId.message}</p>
          ) : null}
        </div>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            className="size-4 rounded border-border accent-accent"
            {...register("maintenanceMode")}
          />
          فعال‌سازی حالت تعمیر و نگهداری (سایت برای بازدیدکنندگان غیرقابل دسترس می‌شود)
        </label>
      </Card>

      {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" isLoading={isSubmitting}>
          ذخیره تنظیمات
        </Button>
      </div>
    </form>
  );
}

export { SiteSettingsForm };
