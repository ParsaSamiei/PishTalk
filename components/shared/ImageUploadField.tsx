"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value?: string | null;
  readonly onChange: (url: string) => void;
  readonly folder: "events" | "blog" | "gallery" | "profile" | "sponsors";
  readonly error?: string;
}

function ImageUploadField({ id, label, value, onChange, folder, error }: ImageUploadFieldProps) {
  const d = useDictionary();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setLocalError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });

      // A rejection can come from a proxy in front of the app rather than from
      // the route handler, in which case the body is an HTML error page, not
      // JSON. Parsing it unconditionally turned every such failure into a
      // "JSON.parse: unexpected character" error that hid the real cause, so
      // branch on the status and content type before trusting the body.
      if (res.status === 413) throw new Error(d.errors.uploadTooLarge);

      const isJson = res.headers.get("content-type")?.includes("application/json");
      if (!isJson) throw new Error(d.errors.uploadFailed);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? d.errors.uploadFailed);
      onChange(data.url);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : d.errors.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      {value ? (
        <div className="relative w-fit">
          <Image
            src={value}
            alt=""
            width={240}
            height={135}
            className="rounded-[var(--radius-input)] border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -end-2 flex size-7 items-center justify-center rounded-full bg-danger text-white shadow-md"
            aria-label={d.upload.remove}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void uploadFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-input)] border-2 border-dashed border-border p-8 text-center transition-colors",
            isDragging && "border-accent bg-surface-secondary",
          )}
        >
          <UploadCloud className="size-8 text-text-secondary" aria-hidden="true" />
          <p className="text-sm text-text-secondary">{d.upload.prompt}</p>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadFile(file);
            }}
          />
        </div>
      )}

      {isUploading ? <p className="text-sm text-text-secondary">{d.upload.uploading}</p> : null}
      {localError || error ? <p className="text-sm text-danger">{localError ?? error}</p> : null}
    </div>
  );
}

export { ImageUploadField };
