"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "warning" | "danger" | "info";

const VARIANT_META: Record<ToastVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  danger: { icon: XCircle, className: "text-danger" },
  info: { icon: Info, className: "text-info" },
};

export interface ToastData {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant: ToastVariant;
}

const ToastViewport = ToastPrimitive.Viewport;
const ToastProviderPrimitive = ToastPrimitive.Provider;

/**
 * Single toast card. Per docs/04_DESIGN_SYSTEM.md ("Notifications: Top
 * Right, Auto Dismiss, Success/Warning/Error/Information types").
 */
function ToastCard({ toast, onOpenChange }: { toast: ToastData; onOpenChange: (open: boolean) => void }) {
  const { icon: Icon, className } = VARIANT_META[toast.variant];

  return (
    <ToastPrimitive.Root
      duration={4000}
      onOpenChange={onOpenChange}
      className="flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-lg data-[state=closed]:opacity-0"
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", className)} aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        <ToastPrimitive.Title className="text-sm font-semibold text-text-primary">
          {toast.title}
        </ToastPrimitive.Title>
        {toast.description ? (
          <ToastPrimitive.Description className="text-sm text-text-secondary">
            {toast.description}
          </ToastPrimitive.Description>
        ) : null}
      </div>
      <ToastPrimitive.Close
        aria-label="بستن"
        className="ms-auto text-text-light hover:text-text-primary"
      >
        <X className="size-4" aria-hidden="true" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export { ToastProviderPrimitive, ToastViewport, ToastCard };
