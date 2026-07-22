"use client";

import * as React from "react";

import { ToastProviderPrimitive, ToastViewport, ToastCard, type ToastData, type ToastVariant } from "@/components/ui/Toast";

interface ToastContextValue {
  readonly showToast: (title: string, options?: { description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/**
 * App-wide toast notifications. Wrap the app once in the root layout;
 * call useToast() anywhere below it. Replaces ad-hoc inline "saved!" text
 * with a consistent, dismissible, auto-expiring notification per
 * docs/04_DESIGN_SYSTEM.md.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const showToast = React.useCallback<ToastContextValue["showToast"]>((title, options) => {
    const id = crypto.randomUUID();
    setToasts((current) => [
      ...current,
      { id, title, description: options?.description, variant: options?.variant ?? "success" },
    ]);
  }, []);

  function removeToast(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastProviderPrimitive swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          />
        ))}
        <ToastViewport className="fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none" />
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
