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
import { trackEvent } from "@/lib/analytics";

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
  const eligibilityConfirmed = watch("eligibilityConfirmed");
  const needsCertificateName = isPersianScript(firstName ?? "") || isPersianScript(lastName ?? "");

  // Funnel: fire once, the first time the visitor touches any field, so we
  // can distinguish "viewed the form" (a plain Umami pageview) from
  // "actually started filling it out".
  const hasTrackedStartRef = React.useRef(false);
  React.useEffect(() => {
    if (hasTrackedStartRef.current) return;
    if (Object.keys(dirtyFields).length === 0) return;
    hasTrackedStartRef.current = true;
    trackEvent("registration_started", { eventId });
  }, [dirtyFields, eventId]);

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
    trackEvent("registration_submitted", { eventId });
    const result = await createRegistration(eventId, values);

    if (result.success) {
      // No explicit "success" event: the /register-success navigation is
      // itself tracked as a pageview by the Umami tracker, and doubling up
      // here would just double-count the same conversion.
      router.push("/register-success");
    } else {
      trackEvent("registration_failed", {
        eventId,
        reason: result.errorCode ?? "UNKNOWN",
      });
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
        <p id="notes-hint" className="whitespace-pre-line text-sm text-text-secondary">
          {d.registration.notesHint}
        </p>
        <Textarea
          id="notes"
          rows={4}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby="notes-hint"
          {...register("notes")}
        />
        {errors.notes ? (
          <p className="text-sm text-danger">{errors.notes.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-danger">{serverError}</p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="eligibilityConfirmed"
          className="flex items-start gap-3 text-sm text-text-primary"
        >
          <input
            id="eligibilityConfirmed"
            type="checkbox"
            aria-invalid={Boolean(errors.eligibilityConfirmed)}
            className="mt-0.5 size-4 shrink-0 rounded border-border accent-accent"
            {...register("eligibilityConfirmed")}
          />
          <span>{d.registration.eligibility}</span>
        </label>
        {errors.eligibilityConfirmed ? (
          <p className="text-sm text-danger">{errors.eligibilityConfirmed.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        isLoading={isSubmitting}
        disabled={!eligibilityConfirmed}
      >
        {d.registration.submit}
      </Button>
    </form>
  );
}

export { RegistrationForm };
