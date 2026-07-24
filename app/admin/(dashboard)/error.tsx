"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="size-12 text-danger" aria-hidden="true" />
      <h1 className="text-xl font-bold text-text-primary">مشکلی پیش آمد</h1>
      <p className="text-text-secondary">بارگذاری این بخش با خطا مواجه شد.</p>
      <Button onClick={reset}>تلاش دوباره</Button>
    </div>
  );
}
