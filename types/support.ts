/**
 * The institute's bank details as shown on the public /support page.
 *
 * Values are stored normalized (16 bare digits for the card, "IR" + 24 digits
 * for the SHEBA) and grouped for display only — see lib/bank.ts.
 */
export interface SupportPaymentInfo {
  readonly cardNumber: string;
  readonly cardHolder: string;
  /** Optional: card-to-card is the common case, SHEBA is for bank transfers. */
  readonly sheba: string | null;
}
