import { CreditCard } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/shared/CopyButton";
import { formatCardNumber, formatSheba } from "@/lib/bank";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SupportPaymentInfo } from "@/types/support";

interface PaymentDetailsCardProps {
  readonly payment: SupportPaymentInfo;
  readonly dictionary: Dictionary;
}

interface DetailRowProps {
  readonly label: string;
  /** Grouped for reading. */
  readonly display: string;
  /** Bare value placed on the clipboard, or null for non-copyable rows. */
  readonly copyValue: string | null;
  /**
   * Bank numbers read left-to-right even inside the RTL layout and want
   * tabular figures. The account holder is ordinary Persian text and must
   * follow the page direction instead.
   */
  readonly numeric?: boolean;
}

function DetailRow({ label, display, copyValue, numeric = false }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0 last:pb-0">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-sm text-text-secondary">{label}</span>
        {/*
          `select-all` makes a tap select the whole value, which is the manual
          fallback when the clipboard API is unavailable (insecure origin).
        */}
        <span
          dir={numeric ? "ltr" : undefined}
          className={cn(
            "select-all truncate text-base text-text-primary sm:text-lg",
            numeric && "font-mono tabular-nums",
          )}
        >
          {display}
        </span>
      </div>
      {copyValue ? <CopyButton value={copyValue} label={label} /> : null}
    </div>
  );
}

/**
 * The institute's bank details on /support, so a visitor can transfer money
 * before uploading their receipt.
 *
 * A server component: these values come from site settings and none of the
 * markup is interactive except the copy buttons, which are their own client
 * islands.
 */
function PaymentDetailsCard({ payment, dictionary: d }: PaymentDetailsCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-hover"
        >
          <CreditCard className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-text-primary">
            {d.support.paymentTitle}
          </h2>
          <p className="text-sm text-text-secondary">{d.support.paymentLead}</p>
        </div>
      </div>

      <div className="flex flex-col">
        <DetailRow
          label={d.support.cardNumber}
          display={formatCardNumber(payment.cardNumber)}
          copyValue={payment.cardNumber}
          numeric
        />
        <DetailRow
          label={d.support.cardHolder}
          display={payment.cardHolder}
          copyValue={null}
        />
        {payment.sheba ? (
          <DetailRow
            label={d.support.sheba}
            display={formatSheba(payment.sheba)}
            copyValue={payment.sheba}
            numeric
          />
        ) : null}
      </div>
    </Card>
  );
}

export { PaymentDetailsCard };
