"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  registrationFormSchema,
  type RegistrationFormValues,
} from "@/features/registration/types/registration";
import { createRegistration } from "@/features/registration/actions/createRegistration";

interface RegistrationFormProps {
  readonly eventId: string;
}

function RegistrationForm({ eventId }: RegistrationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
  });

  async function onSubmit(values: RegistrationFormValues) {
    setServerError(null);
    const result = await createRegistration(eventId, values);

    if (result.success) {
      router.push("/register-success");
    } else {
      setServerError(result.error ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">نام</Label>
          <Input id="firstName" aria-invalid={Boolean(errors.firstName)} {...register("firstName")} />
          {errors.firstName ? (
            <p className="text-sm text-danger">{errors.firstName.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">نام خانوادگی</Label>
          <Input id="lastName" aria-invalid={Boolean(errors.lastName)} {...register("lastName")} />
          {errors.lastName ? (
            <p className="text-sm text-danger">{errors.lastName.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">شماره موبایل</Label>
        <Input
          id="phone"
          dir="ltr"
          inputMode="numeric"
          placeholder="09xxxxxxxxx"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone ? <p className="text-sm text-danger">{errors.phone.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">ایمیل (اختیاری)</Label>
        <Input id="email" type="email" dir="ltr" {...register("email")} />
        {errors.email ? <p className="text-sm text-danger">{errors.email.message}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="university">دانشگاه (اختیاری)</Label>
          <Input id="university" {...register("university")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">شرکت (اختیاری)</Label>
          <Input id="company" {...register("company")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profession">حرفه (اختیاری)</Label>
        <Input id="profession" {...register("profession")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">توضیحات (اختیاری)</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

      <Button type="submit" size="lg" isLoading={isSubmitting}>
        ثبت‌نام در رویداد
      </Button>
    </form>
  );
}

export { RegistrationForm };
