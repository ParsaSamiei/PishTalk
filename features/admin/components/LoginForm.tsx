"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("ایمیل یا رمز عبور اشتباه است.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">رمز عبور</Label>
        {/* dir="ltr" on the wrapper too, so the icon's "end" side matches
            the input's own left-to-right text direction (i.e. sits on the
            right) regardless of the page's overall RTL layout. */}
        <div dir="ltr" className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete="current-password"
            required
            className="pe-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            aria-pressed={showPassword}
            tabIndex={-1}
            className="absolute inset-y-0 inset-e-0 flex w-10 items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" size="lg" isLoading={isSubmitting}>
        ورود
      </Button>
    </form>
  );
}

export { LoginForm };
