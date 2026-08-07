"use client";

import * as React from "react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import type { SponsorFormValues } from "@/features/admin/types/sponsorForm";

interface SponsorFormProps {
  readonly defaultValues?: Partial<SponsorFormValues>;
  readonly onSubmit: (
    values: SponsorFormValues,
  ) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function SponsorForm({ defaultValues, onSubmit, submitLabel }: SponsorFormProps) {
  const [name, setName] = React.useState(defaultValues?.name ?? "");
  const [logo, setLogo] = React.useState(defaultValues?.logo ?? "");
  const [url, setUrl] = React.useState(defaultValues?.url ?? "");
  const [description, setDescription] = React.useState(defaultValues?.description ?? "");
  const [descriptionEn, setDescriptionEn] = React.useState(defaultValues?.descriptionEn ?? "");
  const [sortOrder, setSortOrder] = React.useState(defaultValues?.sortOrder ?? 0);
  const [published, setPublished] = React.useState(defaultValues?.published ?? true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await onSubmit({
      name,
      logo,
      url,
      description,
      descriptionEn,
      sortOrder,
      published,
    });

    setIsSubmitting(false);
    if (!result.success) setError(result.error ?? "خطایی رخ داد.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">نام حامی</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      {/* Optional -- a supporter can be listed by name alone, with no logo. */}
      <ImageUploadField
        id="logo"
        label="لوگو (اختیاری)"
        value={logo}
        onChange={setLogo}
        folder="sponsors"
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="url">
          لینک وب‌سایت <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <Input
          id="url"
          dir="ltr"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          توضیحات <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <Textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* English translation. Optional -- the public site shows the Persian
          text to English visitors when this is left empty. */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="descriptionEn">
          توضیحات (انگلیسی) <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <Textarea
          id="descriptionEn"
          rows={3}
          dir="ltr"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sortOrder">ترتیب نمایش</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>
        <label className="mt-7 flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded border-border accent-accent"
          />
          نمایش در صفحه حامیان
        </label>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export { SponsorForm };
