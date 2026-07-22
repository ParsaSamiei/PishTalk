"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RichTextEditor } from "@/features/admin/components/RichTextEditor";
import { blogFormSchema, type BlogFormValues, type BlogFormInput } from "@/features/admin/types/blogForm";

interface CategoryOption {
  readonly id: string;
  readonly name: string;
}

interface BlogFormProps {
  readonly defaultValues?: Partial<BlogFormValues>;
  readonly categories: readonly CategoryOption[];
  readonly onSubmit: (values: BlogFormValues) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function BlogForm({ defaultValues, categories, onSubmit, submitLabel }: BlogFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

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
    const result = await onSubmit(values);
    if (!result.success) setServerError(result.error ?? "خطایی رخ داد.");
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
          <Label htmlFor="excerpt">خلاصه</Label>
          <Textarea
            id="excerpt"
            rows={2}
            aria-invalid={Boolean(errors.excerpt)}
            {...register("excerpt")}
          />
          {errors.excerpt ? <p className="text-sm text-danger">{errors.excerpt.message}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="coverImage">آدرس تصویر کاور (اختیاری)</Label>
          <Input id="coverImage" dir="ltr" {...register("coverImage")} />
          {errors.coverImage ? (
            <p className="text-sm text-danger">{errors.coverImage.message}</p>
          ) : null}
        </div>

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
            <Input id="readingTime" type="number" min={1} {...register("readingTime")} />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <Label htmlFor="content">محتوا</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
        {errors.content ? <p className="text-sm text-danger">{errors.content.message}</p> : null}
      </Card>

      <label className="flex items-center gap-2 text-sm text-text-primary">
        <input
          type="checkbox"
          className="size-4 rounded border-border accent-accent"
          {...register("published")}
        />
        انتشار در سایت
      </label>

      {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

      <Button type="submit" size="lg" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export { BlogForm };
