"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ExternalLink } from "lucide-react";

/**
 * Opens a submitted receipt at full size.
 *
 * The image is fetched from /api/admin/receipts/[id]/image, which is behind
 * requireAdmin() — receipts are not public files and have no shareable URL.
 *
 * A plain <img> rather than next/image: the source is an authenticated,
 * no-store route, and `images.unoptimized` is true project-wide anyway, so the
 * optimizer would add nothing but a second request path to reason about.
 */

interface ReceiptImageDialogProps {
  readonly id: string;
  readonly fullName: string;
}

function ReceiptImageDialog({ id, fullName }: ReceiptImageDialogProps) {
  const src = `/api/admin/receipts/${id}/image`;
  const label = `مشاهده رسید ${fullName}`;

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        aria-label={label}
        className="block overflow-hidden rounded-lg border border-border transition-colors hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="lazy"
          className="size-14 bg-surface-secondary object-cover"
        />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-card border border-border bg-surface p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <DialogPrimitive.Title className="text-lg font-semibold text-text-primary">
              رسید {fullName}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-lg px-3 py-1 text-sm text-text-secondary hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              بستن
            </DialogPrimitive.Close>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`تصویر رسید ارسالی توسط ${fullName}`}
            className="max-h-[70vh] w-full rounded-lg object-contain"
          />

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start text-sm text-accent-hover hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            باز کردن در تب جدید
          </a>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ReceiptImageDialog };
