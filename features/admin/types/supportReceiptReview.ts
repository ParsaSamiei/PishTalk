import { z } from "zod";

/**
 * Admin review of a submitted receipt.
 *
 * PENDING is deliberately not an accepted value: this schema describes the act
 * of reviewing, and "un-reviewing" a receipt is not a workflow the admin panel
 * offers. A mistaken decision is corrected by choosing the other one.
 */
export const reviewReceiptSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export type ReviewReceiptValues = z.infer<typeof reviewReceiptSchema>;
