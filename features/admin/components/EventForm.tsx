"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { eventFormSchema, type EventFormValues, type EventFormInput } from "@/features/admin/types/eventForm";

const STATUS_OPTIONS: ReadonlyArray<{ value: EventFormValues["status"]; label: string }> = [
  { value: "DRAFT", label: "پیش‌نویس" },
  { value: "PUBLISHED", label: "منتشرشده" },
  { value: "ARCHIVED", label: "آرشیوشده" },
  { value: "CANCELLED", label: "لغوشده" },
];

interface EventFormProps {
  readonly defaultValues?: Partial<EventFormValues>;
  readonly onSubmit: (values: EventFormValues) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function toDateInputValue(date?: Date | string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function EventForm({ defaultValues, onSubmit, submitLabel }: EventFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      status: "DRAFT",
      timeline: [],
      ...defaultValues,
      date: toDateInputValue(defaultValues?.date),
    } as EventFormInput,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "timeline" });

  async function handleFormSubmit(values: EventFormValues) {
    setServerError(null);
    const result = await onSubmit(values);
    if (!result.success) {
      setServerError(result.error ?? "خطایی رخ داد.");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-8">
      <Card className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">عنوان</Label>
            <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
            {errors.title ? <p className="text-sm text-danger">{errors.title.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">نامک (slug)</Label>
            <Input id="slug" dir="ltr" aria-invalid={Boolean(errors.slug)} {...register("slug")} />
            {errors.slug ? <p className="text-sm text-danger">{errors.slug.message}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="subtitle">زیرعنوان (اختیاری)</Label>
          <Input id="subtitle" {...register("subtitle")} />
        </div>

        {/* English translations. Optional — the public site shows the Persian
            text to English visitors when these are left empty. */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="titleEn">
              عنوان (انگلیسی){" "}
              <span className="font-normal text-text-secondary">(اختیاری)</span>
            </Label>
            <Input id="titleEn" dir="ltr" {...register("titleEn")} />
            {errors.titleEn ? (
              <p className="text-sm text-danger">{errors.titleEn.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subtitleEn">
              زیرعنوان (انگلیسی){" "}
              <span className="font-normal text-text-secondary">(اختیاری)</span>
            </Label>
            <Input id="subtitleEn" dir="ltr" {...register("subtitleEn")} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">توضیحات</Label>
          <Textarea
            id="description"
            rows={5}
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />
          {errors.description ? (
            <p className="text-sm text-danger">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="descriptionEn">
            توضیحات (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Textarea id="descriptionEn" rows={5} dir="ltr" {...register("descriptionEn")} />
        </div>

        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <ImageUploadField
              id="coverImage"
              label="تصویر کاور (اختیاری)"
              value={field.value}
              onChange={field.onChange}
              folder="events"
              error={errors.coverImage?.message}
            />
          )}
        />
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">زمان و مکان</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">تاریخ</Label>
            <Input
              id="date"
              type="date"
              aria-invalid={Boolean(errors.date)}
              {...register("date")}
            />
            {errors.date ? <p className="text-sm text-danger">{errors.date.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="startTime">ساعت شروع</Label>
            <Input id="startTime" placeholder="18:00" {...register("startTime")} />
            {errors.startTime ? (
              <p className="text-sm text-danger">{errors.startTime.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="endTime">ساعت پایان (اختیاری)</Label>
            <Input id="endTime" placeholder="20:30" {...register("endTime")} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">مکان</Label>
          <Input id="location" aria-invalid={Boolean(errors.location)} {...register("location")} />
          {errors.location ? (
            <p className="text-sm text-danger">{errors.location.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="locationEn">
            مکان (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Input id="locationEn" dir="ltr" {...register("locationEn")} />
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">سخنران و ظرفیت</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="speakerName">نام سخنران (اختیاری)</Label>
            <Input id="speakerName" {...register("speakerName")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">ظرفیت (اختیاری)</Label>
            <Input id="capacity" type="number" min={1} {...register("capacity")} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="speakerNameEn">
            نام سخنران (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Input id="speakerNameEn" dir="ltr" {...register("speakerNameEn")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="speakerBio">بیوگرافی سخنران (اختیاری)</Label>
          <Textarea id="speakerBio" rows={3} {...register("speakerBio")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="speakerBioEn">
            بیوگرافی سخنران (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Textarea id="speakerBioEn" rows={3} dir="ltr" {...register("speakerBioEn")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">وضعیت</Label>
          <select
            id="status"
            className="h-12 rounded-[var(--radius-input)] border border-border bg-surface px-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            {...register("status")}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">برنامه زمانی</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({ time: "", title: "", description: "", titleEn: "", descriptionEn: "" })
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            افزودن مرحله
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-text-secondary">هنوز مرحله‌ای اضافه نشده است.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-3 rounded-[var(--radius-input)] border border-border p-4"
              >
                <div className="grid gap-3 sm:grid-cols-[120px_1fr_1fr_auto] sm:items-start">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`timeline.${index}.time`}>زمان</Label>
                    <Input
                      id={`timeline.${index}.time`}
                      placeholder="18:00"
                      {...register(`timeline.${index}.time` as const)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`timeline.${index}.title`}>عنوان</Label>
                    <Input
                      id={`timeline.${index}.title`}
                      {...register(`timeline.${index}.title` as const)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`timeline.${index}.description`}>توضیح (اختیاری)</Label>
                    <Input
                      id={`timeline.${index}.description`}
                      {...register(`timeline.${index}.description` as const)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7 text-danger hover:bg-danger/10"
                    aria-label="حذف مرحله"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
                {/* English translation of this timeline step. Optional, same
                    Persian-fallback rule as the rest of the form. */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`timeline.${index}.titleEn`}>
                      عنوان (انگلیسی){" "}
                      <span className="font-normal text-text-secondary">(اختیاری)</span>
                    </Label>
                    <Input
                      id={`timeline.${index}.titleEn`}
                      dir="ltr"
                      {...register(`timeline.${index}.titleEn` as const)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`timeline.${index}.descriptionEn`}>
                      توضیح (انگلیسی){" "}
                      <span className="font-normal text-text-secondary">(اختیاری)</span>
                    </Label>
                    <Input
                      id={`timeline.${index}.descriptionEn`}
                      dir="ltr"
                      {...register(`timeline.${index}.descriptionEn` as const)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-text-primary">سئو (انگلیسی)</h2>
        {/* The Persian seoTitle/seoDescription columns exist in the database but
            have never had inputs on this form; only the English counterparts are
            editable here. */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="seoTitleEn">
            عنوان سئو (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Input id="seoTitleEn" dir="ltr" {...register("seoTitleEn")} />
          {errors.seoTitleEn ? (
            <p className="text-sm text-danger">{errors.seoTitleEn.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="seoDescriptionEn">
            توضیحات سئو (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Textarea id="seoDescriptionEn" rows={2} dir="ltr" {...register("seoDescriptionEn")} />
          {errors.seoDescriptionEn ? (
            <p className="text-sm text-danger">{errors.seoDescriptionEn.message}</p>
          ) : null}
        </div>
      </Card>

      {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

      <Button type="submit" size="lg" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export { EventForm };
