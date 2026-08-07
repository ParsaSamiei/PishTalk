"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/lib/i18n/client";
import {
  createRegistrationFormSchema,
  isPersianScript,
  type RegistrationFormValues,
} from "@/features/registration/types/registration";
import { transliteratePersianName } from "@/features/registration/utils/transliterate";
import { createRegistration } from "@/features/registration/actions/createRegistration";

interface RegistrationFormProps {
  readonly eventId: string;
}

function RegistrationForm({ eventId }: RegistrationFormProps) {
  const d = useDictionary();
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const schema = React.useMemo(() => createRegistrationFormSchema(d), [d]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const needsCertificateName = isPersianScript(firstName ?? "") || isPersianScript(lastName ?? "");

  // Pre-fill a transliteration suggestion the first time the field appears,
  // but never overwrite something the visitor has already typed/edited.
  React.useEffect(() => {
    if (needsCertificateName && !dirtyFields.certificateName) {
      const suggestion = [firstName, lastName]
        .filter(Boolean)
        .map((part) => transliteratePersianName(part ?? ""))
        .join(" ")
        .trim();
      setValue("certificateName", suggestion);
    }
  }, [needsCertificateName, firstName, lastName, dirtyFields.certificateName, setValue]);

  async function onSubmit(values: RegistrationFormValues) {
    setServerError(null);
    const result = await createRegistration(eventId, values);

    if (result.success) {
      router.push("/register-success");
    } else {
      setServerError(result.error ?? d.errors.generic);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">{d.registration.firstName}</Label>
          <Input
            id="firstName"
            aria-invalid={Boolean(errors.firstName)}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-sm text-danger">{errors.firstName.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">{d.registration.lastName}</Label>
          <Input
            id="lastName"
            aria-invalid={Boolean(errors.lastName)}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-sm text-danger">{errors.lastName.message}</p>
          ) : null}
        </div>
      </div>

      {needsCertificateName ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="certificateName">{d.registration.certificateName}</Label>
          <Input
            id="certificateName"
            dir="ltr"
            aria-invalid={Boolean(errors.certificateName)}
            aria-describedby="certificateName-hint"
            {...register("certificateName")}
          />
          <p id="certificateName-hint" className="text-sm text-text-secondary">
            {d.registration.certificateNameHint}
          </p>
          {errors.certificateName ? (
            <p className="text-sm text-danger">{errors.certificateName.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">{d.registration.phone}</Label>
        <Input
          id="phone"
          dir="ltr"
          inputMode="numeric"
          placeholder="09xxxxxxxxx"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-sm text-danger">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{d.registration.email}</Label>
        <Input id="email" type="email" dir="ltr" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-danger">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="university">{d.registration.university}</Label>
          <Input id="university" {...register("university")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">{d.registration.company}</Label>
          <Input id="company" {...register("company")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profession">{d.registration.profession}</Label>
        <Input id="profession" {...register("profession")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">{d.registration.notes}</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      {serverError ? (
        <p className="text-sm text-danger">{serverError}</p>
      ) : null}

      <Button type="submit" size="lg" isLoading={isSubmitting}>
        {d.registration.submit}
      </Button>
    </form>
  );
}

export { RegistrationForm };
