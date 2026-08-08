"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Receipt } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDictionary } from "@/lib/i18n/client";
import {
  createReceiptFormSchema,
  RECEIPT_ALLOWED_TYPES,
  RECEIPT_MAX_BYTES,
  type ReceiptFormInput,
  type ReceiptFormValues,
} from "@/features/support/types/receipt";

/**
 * Public form for submitting a bank transfer receipt.
 *
 * The image is sent in the same request as the text fields rather than
 * uploaded first: a standalone public upload endpoint would write files with
 * no owning row, which is an orphan-file disk filler. One request, one row,
 * one file.
 */
function ReceiptForm() {
  const d = useDictionary();
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const schema = React.useMemo(() => createReceiptFormSchema(d), [d]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReceiptFormInput, unknown, ReceiptFormValues>({
    resolver: zodResolver(schema),
    // amountToman is a string on the way in and a number on the way out, so
    // the input type must be seeded with "" rather than 0.
    defaultValues: { fullName: "", phone: "", amountToman: "", website: "" },
  });

  // A data URL rather than URL.createObjectURL: an object URL has to be
  // revoked, and every place to do that is a trap — revoking in an effect
  // cleanup breaks the preview under StrictMode's double-invoke, and tracking
  // it in a ref means reading that ref from the submit handler. A data URL is
  // garbage collected with the state that holds it.
  function selectFile(selected: File | null) {
    setFile(selected);

    if (!selected) {
      setPreviewUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(selected);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFileError(null);

    if (!selected) {
      selectFile(null);
      return;
    }
    // A friendly pre-check only. The server re-checks by decoding, because
    // `type` comes from the browser and a direct POST can claim anything.
    if (!(RECEIPT_ALLOWED_TYPES as readonly string[]).includes(selected.type)) {
      selectFile(null);
      setFileError(d.validation.receiptFormat);
      return;
    }
    if (selected.size > RECEIPT_MAX_BYTES) {
      selectFile(null);
      setFileError(d.errors.uploadTooLarge);
      return;
    }
    selectFile(selected);
  }

  async function onSubmit(values: ReceiptFormValues) {
    setServerError(null);

    if (!file) {
      setFileError(d.validation.receiptRequired);
      return;
    }

    const body = new FormData();
    body.append("fullName", values.fullName);
    body.append("phone", values.phone);
    body.append("amountToman", String(values.amountToman));
    body.append("website", values.website ?? "");
    body.append("receipt", file);

    try {
      const response = await fetch("/api/support/receipt", {
        method: "POST",
        body,
      });

      // A reverse proxy enforcing its own body limit answers with an HTML
      // error page, not JSON — parsing it blindly would throw and surface as
      // a generic failure. Same defence as components/shared/ImageUploadField.
      if (response.status === 413) {
        setServerError(d.errors.uploadTooLarge);
        return;
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        setServerError(d.errors.receiptFailed);
        return;
      }

      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        setServerError(result.error ?? d.errors.receiptFailed);
        return;
      }

      setSubmitted(true);
      selectFile(null);
      reset();
    } catch {
      setServerError(d.errors.receiptFailed);
    }
  }

  if (submitted) {
    return (
      <Card className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-text-primary">
          {d.support.successTitle}
        </h3>
        <p className="text-sm text-text-secondary">{d.support.successBody}</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          {d.support.submitAnother}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-hover"
        >
          <Receipt className="size-5" />
        </span>
        <h2 className="mt-2 text-lg font-bold text-text-primary">
          {d.support.formTitle}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="receiptFullName">{d.support.fullNameLabel}</Label>
          <Input id="receiptFullName" autoComplete="name" {...register("fullName")} />
          {errors.fullName ? (
            <p className="text-sm text-danger">{errors.fullName.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="receiptPhone">{d.support.phoneLabel}</Label>
            <Input
              id="receiptPhone"
              dir="ltr"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="09123456789"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="text-sm text-danger">{errors.phone.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="receiptAmount">{d.support.amountLabel}</Label>
            <Input
              id="receiptAmount"
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
              {...register("amountToman")}
            />
            {errors.amountToman ? (
              <p className="text-sm text-danger">{errors.amountToman.message}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="receiptFile">{d.support.receiptLabel}</Label>
          <input
            id="receiptFile"
            type="file"
            accept={RECEIPT_ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            aria-describedby="receiptFileHint"
            className="block w-full cursor-pointer rounded-lg border border-border bg-surface text-sm text-text-secondary file:mr-4 file:cursor-pointer file:rounded-e-none file:rounded-s-lg file:border-0 file:bg-accent/15 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-accent-hover hover:file:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          />
          <p id="receiptFileHint" className="text-xs text-text-secondary">
            {d.support.receiptHint}
          </p>
          {fileError ? <p className="text-sm text-danger">{fileError}</p> : null}
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              width={160}
              height={160}
              unoptimized
              className="mt-1 h-32 w-auto rounded-lg border border-border object-contain"
            />
          ) : null}
        </div>

        {/*
          Honeypot. Zero-sized and clipped rather than display:none (which some
          bots skip), hidden from assistive tech, and removed from the tab
          order so no human can reach it by accident.
        */}
        <div aria-hidden="true" className="h-0 w-0 overflow-hidden">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? d.support.submitting : d.support.submit}
        </Button>
      </form>
    </Card>
  );
}

export { ReceiptForm };
