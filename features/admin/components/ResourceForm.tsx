"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { resourceFormSchema, type ResourceFormValues } from "@/features/admin/types/resourceForm";

const TYPE_OPTIONS: ReadonlyArray<{ value: ResourceFormValues["resourceType"]; label: string }> = [
  { value: "PDF", label: "PDF" },
  { value: "PRESENTATION", label: "اسلاید" },
  { value: "GITHUB", label: "گیت‌هاب" },
  { value: "VIDEO", label: "ویدیو" },
  { value: "RESEARCH_PAPER", label: "مقاله پژوهشی" },
  { value: "EXTERNAL_LINK", label: "لینک خارجی" },
];

interface EventOption {
  readonly id: string;
  readonly title: string;
}

interface ResourceFormProps {
  readonly defaultValues?: Partial<ResourceFormValues>;
  readonly events: readonly EventOption[];
  readonly onSubmit: (
    values: ResourceFormValues
  ) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function ResourceForm({ defaultValues, events, onSubmit, submitLabel }: ResourceFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: { resourceType: "PDF", ...defaultValues },
  });

  async function handleFormSubmit(values: ResourceFormValues) {
    setServerError(null);
    const result = await onSubmit(values);
    if (!result.success) setServerError(result.error ?? "خطایی رخ داد.");
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex max-w-2xl flex-col gap-8">
      <Card className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">عنوان</Label>
          <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
          {errors.title ? <p className="text-sm text-danger">{errors.title.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">توضیحات (اختیاری)</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="resourceType">نوع منبع</Label>
          <select
            id="resourceType"
            className="h-12 rounded-[var(--radius-input)] border border-border bg-surface px-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            {...register("resourceType")}
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="fileUrl">آدرس فایل (اختیاری در صورت داشتن لینک خارجی)</Label>
          <Input id="fileUrl" dir="ltr" {...register("fileUrl")} />
          {errors.fileUrl ? <p className="text-sm text-danger">{errors.fileUrl.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="externalUrl">لینک خارجی (اختیاری در صورت داشتن فایل)</Label>
          <Input id="externalUrl" dir="ltr" {...register("externalUrl")} />
          {errors.externalUrl ? (
            <p className="text-sm text-danger">{errors.externalUrl.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="eventId">رویداد مرتبط (اختیاری)</Label>
          <select
            id="eventId"
            className="h-12 rounded-[var(--radius-input)] border border-border bg-surface px-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            {...register("eventId")}
          >
            <option value="">بدون رویداد</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

      <Button type="submit" size="lg" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export { ResourceForm };
