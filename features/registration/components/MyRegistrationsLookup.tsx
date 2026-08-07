"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import { Calendar, MapPin, Search } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { useDictionary, useLocale } from "@/lib/i18n/client";
import { pick } from "@/lib/i18n/content";
import { formatEventDate } from "@/utils/formatDate";
import {
  createLookupRegistrationsSchema,
  type LookupRegistrationsValues,
  type RegistrationLookupItem,
} from "@/features/registration/types/lookupRegistrations";
import { lookupRegistrations } from "@/features/registration/actions/lookupRegistrations";

function MyRegistrationsLookup() {
  const d = useDictionary();
  const { locale } = useLocale();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<RegistrationLookupItem[] | null>(null);

  const schema = React.useMemo(() => createLookupRegistrationsSchema(d), [d]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LookupRegistrationsValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: LookupRegistrationsValues) {
    setServerError(null);
    setResults(null);
    const result = await lookupRegistrations(values);

    if (result.success) {
      setResults(result.registrations ?? []);
    } else {
      setServerError(result.error ?? d.errors.generic);
    }
  }

  const statusVariant: Record<RegistrationLookupItem["status"], BadgeProps["variant"]> = {
    REGISTERED: "info",
    ATTENDED: "success",
    CANCELLED: "danger",
  };

  const statusLabel: Record<RegistrationLookupItem["status"], string> = {
    REGISTERED: d.registration.statusRegistered,
    ATTENDED: d.registration.statusAttended,
    CANCELLED: d.registration.statusCancelled,
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
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

          {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

          <Button type="submit" size="lg" isLoading={isSubmitting}>
            <Search aria-hidden="true" />
            {d.registration.lookupSubmit}
          </Button>
        </form>
      </Card>

      {results !== null ? (
        results.length === 0 ? (
          <EmptyState
            icon={Search}
            title={d.registration.lookupEmptyTitle}
            description={d.registration.lookupEmptyDescription}
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {results.map((registration) => {
              const title = pick(
                locale,
                registration.event.title,
                registration.event.titleEn
              );
              const location = pick(
                locale,
                registration.event.location,
                registration.event.locationEn
              );

              return (
                <li key={registration.id}>
                  <Card asChild className="transition-colors hover:border-accent/40">
                    <Link
                      href={`/events/${registration.event.slug}`}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-text-primary">{title}</h3>
                        <div className="flex flex-col gap-1.5 text-sm text-text-secondary sm:flex-row sm:gap-5">
                          <span className="flex items-center gap-2">
                            <Calendar className="size-4 text-accent-hover" aria-hidden="true" />
                            {formatEventDate(new Date(registration.event.date), locale)}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="size-4 text-accent-hover" aria-hidden="true" />
                            {location}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusVariant[registration.status]} className="w-fit">
                        {statusLabel[registration.status]}
                      </Badge>
                    </Link>
                  </Card>
                </li>
              );
            })}
          </ul>
        )
      ) : null}
    </div>
  );
}

export { MyRegistrationsLookup };
