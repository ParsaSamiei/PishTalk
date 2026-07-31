"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { addGalleryImage } from "@/features/admin/actions/galleryActions";

interface AddGalleryImageFormProps {
  readonly eventId: string;
}

function AddGalleryImageForm({ eventId }: AddGalleryImageFormProps) {
  const router = useRouter();
  const [url, setUrl] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [captionEn, setCaptionEn] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!url) {
      setError("ابتدا یک تصویر آپلود کنید.");
      return;
    }

    setIsSubmitting(true);
    const result = await addGalleryImage(eventId, { url, caption, captionEn });

    setIsSubmitting(false);
    if (result.success) {
      setUrl("");
      setCaption("");
      setCaptionEn("");
      router.refresh();
    } else {
      setError(result.error ?? "خطایی رخ داد.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <ImageUploadField
          id="url"
          label="تصویر"
          value={url}
          onChange={setUrl}
          folder="gallery"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="caption">توضیح (اختیاری)</Label>
        <Input id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      {/* English caption. Optional — the public site shows the Persian caption
          to English visitors when this is left empty. */}
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="captionEn">
          توضیح (انگلیسی){" "}
          <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <Input
          id="captionEn"
          dir="ltr"
          value={captionEn}
          onChange={(e) => setCaptionEn(e.target.value)}
        />
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
