"use client";

import { Wrench } from "lucide-react";

import { useOptionalLocale } from "@/lib/i18n/client";

interface MaintenanceScreenProps {
  readonly siteName: string;
}

function MaintenanceScreen({ siteName }: MaintenanceScreenProps) {
  const { dictionary: d } = useOptionalLocale();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-secondary p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent-hover">
        <Wrench className="size-8" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary">
        {siteName} {d.maintenance.heading}
      </h1>
      <p className="max-w-md text-text-secondary">{d.maintenance.body}</p>
    </div>
  );
}

export { MaintenanceScreen };
