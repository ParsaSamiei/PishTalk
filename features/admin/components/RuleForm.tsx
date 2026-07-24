"use client";

import * as React from "react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { RuleFormValues } from "@/features/admin/types/ruleForm";

const ICON_OPTIONS = [
  { value: "", label: "بدون آیکون" },
  { value: "respect", label: "احترام" },
  { value: "community", label: "جامعه" },
  { value: "discussion", label: "گفتگو" },
] as const;

interface RuleFormProps {
  readonly defaultValues?: Partial<RuleFormValues>;
  readonly onSubmit: (values: RuleFormValues) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function RuleForm({ defaultValues, onSubmit, submitLabel }: RuleFormProps) {
  const [title, setTitle] = React.useState(defaultValues?.title ?? "");
  const [description, setDescription] = React.useState(defaultValues?.description ?? "");
  const [icon, setIcon] = React.useState(defaultValues?.icon ?? "");
  const [sortOrder, setSortOrder] = React.useState(defaultValues?.sortOrder ?? 0);
  const [published, setPublished] = React.useState(defaultValues?.published ?? true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await onSubmit({
      title,
      description,
      icon: icon as RuleFormValues["icon"],
      sortOrder,
      published,
    });

    setIsSubmitting(false);
    if (!result.success) setError(result.error ?? "خطایی رخ داد.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">عنوان</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="icon">آیکون</Label>
          <select
            id="icon"
            value={icon}
            onChange={(e) =>
              setIcon(e.target.value as "" | "respect" | "community" | "discussion")
            }
            className="h-12 rounded-[var(--radius-input)] border border-border bg-surface px-4 text-base text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {ICON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
          نمایش در سایت
        </label>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export { RuleForm };
