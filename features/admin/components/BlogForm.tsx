"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import {
  blogFormSchema,
  type BlogFormValues,
  type BlogFormInput,
} from "@/features/admin/types/blogForm";
import { useToast } from "@/providers/ToastProvider";

/**
 * Tiptap (editor core + starter-kit + link/image extensions) is one of the
 * heaviest client bundles in the app and is only ever needed on this one
 * admin form, so it's split into its own chunk and never rendered on the
 * server. `RichTextEditor` already renders a pulse skeleton while its
 * internal `useEditor()` call resolves, so the loading state lines up with
 * this component's own skeleton exactly.
 */
const RichTextEditor = dynamic(
  () =>
    import("@/features/admin/components/RichTextEditor").then(
      (mod) => mod.RichTextEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-64 animate-pulse rounded-[var(--radius-input)] border border-border bg-surface-secondary" />
    ),
  },
);

interface CategoryOption {
  readonly id: string;
  readonly name: string;
}

interface BlogFormProps {
  readonly defaultValues?: Partial<BlogFormValues>;
  readonly categories: readonly CategoryOption[];
  readonly onSubmit: (
    values: BlogFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function BlogForm({
  defaultValues,
  categories,
  onSubmit,
  submitLabel,
}: BlogFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormInput, unknown, BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: { published: false, ...defaultValues } as BlogFormInput,
  });

  async function handleFormSubmit(values: BlogFormValues) {
    setServerError(null);
    try {
      const result = await onSubmit(values);
      if (result.success) {
        showToast("مطلب با موفقیت ذخیره شد", { variant: "success" });
      } else {
        const message = result.error ?? "خطایی رخ داد.";
        setServerError(message);
        showToast("ذخیره مطلب ناموفق بود", {
          variant: "danger",
          description: message,
        });
      }
    } catch {
      setServerError("خطایی غیرمنتظره رخ داد.");
      showToast("ذخیره مطلب ناموفق بود", { variant: "danger" });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-8"
    >
      <Card className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">عنوان</Label>
            <Input
              id="title"
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title ? (
              <p className="text-sm text-danger">{errors.title.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">نامک (slug)</Label>
            <Input
              id="slug"
              dir="ltr"
              aria-invalid={Boolean(errors.slug)}
              {...register("slug")}
            />
            {errors.slug ? (
              <p className="text-sm text-danger">{errors.slug.message}</p>
            ) : null}
          </div>
        </div>

        {/* English translation. Optional — the public site shows the Persian
            text to English visitors when these are left empty. */}
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
          <Label htmlFor="excerpt">خلاصه</Label>
          <Textarea
            id="excerpt"
            rows={2}
            aria-invalid={Boolean(errors.excerpt)}
            {...register("excerpt")}
          />
          {errors.excerpt ? (
            <p className="text-sm text-danger">{errors.excerpt.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="excerptEn">
            خلاصه (انگلیسی){" "}
            <span className="font-normal text-text-secondary">(اختیاری)</span>
          </Label>
          <Textarea id="excerptEn" rows={2} dir="ltr" {...register("excerptEn")} />
          {errors.excerptEn ? (
            <p className="text-sm text-danger">{errors.excerptEn.message}</p>
          ) : null}
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
              folder="blog"
              error={errors.coverImage?.message}
            />
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="categoryId">دسته‌بندی (اختیاری)</Label>
            <select
              id="categoryId"
              className="h-12 rounded-[var(--radius-input)] border border-border bg-surface px-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              {...register("categoryId")}
            >
              <option value="">بدون دسته‌بندی</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="readingTime">زمان مطالعه (دقیقه، اختیاری)</Label>
            <Input
              id="readingTime"
              type="number"
              min={1}
              {...register("readingTime")}
            />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <Label htmlFor="content">محتوا</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.content ? (
          <p className="text-sm text-danger">{errors.content.message}</p>
        ) : null}
      </Card>

      {/* Second editor instance for the English body. Optional — left empty,
          English visitors see the Persian content. */}
      <Card className="flex flex-col gap-3">
        <Label htmlFor="contentEn">
          محتوا (انگلیسی){" "}
          <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <div dir="ltr">
          <Controller
            name="contentEn"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.contentEn ? (
          <p className="text-sm text-danger">{errors.contentEn.message}</p>
        ) : null}
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
          <Textarea
            id="seoDescriptionEn"
            rows={2}
            dir="ltr"
            {...register("seoDescriptionEn")}
          />
          {errors.seoDescriptionEn ? (
            <p className="text-sm text-danger">{errors.seoDescriptionEn.message}</p>
          ) : null}
        </div>
      </Card>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          className="size-4 rounded border-border accent-accent"
          {...register("published")}
        />
        انتشار در سایت
      </label>

      {serverError ? (
        <p className="text-sm text-danger">{serverError}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        className="self-start"
      >
        {submitLabel}
      </Button>
    </form>
  );
}

export { BlogForm };
