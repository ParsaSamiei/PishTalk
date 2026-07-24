"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { contactFormSchema, type ContactFormValues } from "@/features/contact/types/contact";
import { sendContactMessage } from "@/features/contact/actions/sendContactMessage";

function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    const result = await sendContactMessage(values);

    if (result.success) {
      setSubmitted(true);
      reset();
    } else {
      setServerError(result.error ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-text-primary">پیام شما ارسال شد</h3>
        <p className="text-sm text-text-secondary">
          به‌زودی با شما تماس خواهیم گرفت. متشکریم!
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          ارسال پیام دیگر
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">نام</Label>
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
        <Label htmlFor="email">ایمیل</Label>
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
        <Label htmlFor="message">پیام</Label>
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

      {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

      <Button type="submit" size="lg" isLoading={isSubmitting}>
        ارسال پیام
      </Button>
    </form>
  );
}

export { ContactForm };
