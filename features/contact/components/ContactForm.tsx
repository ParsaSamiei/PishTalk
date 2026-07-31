"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/lib/i18n/client";
import {
  createContactFormSchema,
  type ContactFormValues,
} from "@/features/contact/types/contact";
import { sendContactMessage } from "@/features/contact/actions/sendContactMessage";

function ContactForm() {
  const d = useDictionary();
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const schema = React.useMemo(() => createContactFormSchema(d), [d]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    const result = await sendContactMessage(values);

    if (result.success) {
      setSubmitted(true);
      reset();
    } else {
      setServerError(result.error ?? d.errors.generic);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-text-primary">
          {d.contact.successTitle}
        </h3>
        <p className="text-sm text-text-secondary">{d.contact.successBody}</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          {d.contact.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{d.contact.name}</Label>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-danger">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{d.contact.email}</Label>
        <Input
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-danger">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">
          {d.contact.phone}{" "}
          <span className="font-normal text-text-secondary">
            ({d.common.optional})
          </span>
        </Label>
        <Input
          id="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-danger">{errors.phone.message}</p>
        ) : (
          <p className="text-sm text-text-secondary">{d.contact.phoneHint}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">{d.contact.message}</Label>
        <Textarea
          id="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-danger">{errors.message.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-danger">{serverError}</p>
      ) : null}

      <Button type="submit" size="lg" isLoading={isSubmitting}>
        {d.contact.submit}
      </Button>
    </form>
  );
}

export { ContactForm };
