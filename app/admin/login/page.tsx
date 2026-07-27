import type { Metadata } from "next";
import { Suspense } from "react";

import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/Card";
import { CircuitBackground } from "@/components/illustrations/CircuitBackground";
import { LoginForm } from "@/features/admin/components/LoginForm";

export const metadata: Metadata = {
  title: "ورود مدیریت",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-secondary p-4">
      <CircuitBackground
        id="admin-login"
        className="text-primary/4.5 dark:text-white/4.5"
      />
      <div className="relative flex w-full max-w-sm flex-col items-center gap-8">
        <Logo />
        <Card className="w-full p-8">
          <h1 className="mb-6 text-center text-xl font-bold text-text-primary">
            ورود به پنل مدیریت
          </h1>
          <Suspense>
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
