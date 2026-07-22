"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addGalleryImage } from "@/features/admin/actions/galleryActions";

interface AddGalleryImageFormProps {
  readonly eventId: string;
}

function AddGalleryImageForm({ eventId }: AddGalleryImageFormProps) {
  const router = useRouter();
  const [url, setUrl] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await addGalleryImage(eventId, { url, caption });

    setIsSubmitting(false);
    if (result.success) {
      setUrl("");
      setCaption("");
      router.refresh();
    } else {
      setError(result.error ?? "خطایی رخ داد.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="url">آدرس تصویر</Label>
        <Input
          id="url"
          dir="ltr"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="caption">توضیح (اختیاری)</Label>
        <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <Button type="submit" isLoading={isSubmitting}>
        <Plus className="size-4" aria-hidden="true" />
        افزودن
      </Button>
      {error ? <p className="text-sm text-danger sm:basis-full">{error}</p> : null}
    </form>
  );
}

export { AddGalleryImageForm };
