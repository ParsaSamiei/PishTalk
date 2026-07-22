import type { Metadata } from "next";
import { Suspense } from "react";

import { Logo } from "@/components/shared/Logo";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/features/admin/components/LoginForm";

export const metadata: Metadata = {
  title: "ورود مدیریت",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
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
