import { Wrench } from "lucide-react";

interface MaintenanceScreenProps {
  readonly siteName: string;
}

function MaintenanceScreen({ siteName }: MaintenanceScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-secondary p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent-hover">
        <Wrench className="size-8" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-text-primary">{siteName} در حال به‌روزرسانی است</h1>
      <p className="max-w-md text-text-secondary">
        در حال انجام تغییراتی روی سایت هستیم. لطفاً کمی بعد دوباره سر بزنید.
      </p>
    </div>
  );
}

export { MaintenanceScreen };
