import { z } from "zod";

import {
  isValidCardNumber,
  isValidSheba,
  normalizeCardNumber,
  normalizeSheba,
} from "@/lib/bank";

export const siteSettingsFormSchema = z.object({
  siteName: z.string().trim().min(1).max(100),
  tagline: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  logo: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  favicon: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  heroTitle: z.string().trim().max(200).optional().or(z.literal("")),
  heroSubtitle: z.string().trim().max(300).optional().or(z.literal("")),
  contactEmail: z.string().trim().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  phone2: z.string().trim().max(20).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  instagram: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  telegram: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  pishnamUrl: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  googleMapsEmbed: z.string().trim().max(2000).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(70, "عنوان سئو بهتر است حداکثر ۷۰ حرف باشد").optional().or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(160, "توضیحات سئو بهتر است حداکثر ۱۶۰ حرف باشد")
    .optional()
    .or(z.literal("")),
  defaultOgImage: z.string().trim().url("آدرس معتبر نیست").optional().or(z.literal("")),
  googleAnalyticsId: z
    .string()
    .trim()
    .regex(/^(G-[A-Z0-9]+)?$/, "شناسه Google Analytics معتبر نیست (مثال: G-XXXXXXX)")
    .optional()
    .or(z.literal("")),
  // Optional English translations of the visitor-facing settings. Blank means
  // "not translated yet" and the public site falls back to the Persian value
  // (lib/i18n/content.ts). URLs, analytics and the maintenance flag are
  // locale-independent and deliberately have no English counterpart.
  siteNameEn: z.string().trim().max(100).optional().or(z.literal("")),
  taglineEn: z.string().trim().max(200).optional().or(z.literal("")),
  descriptionEn: z.string().trim().max(500).optional().or(z.literal("")),
  heroTitleEn: z.string().trim().max(200).optional().or(z.literal("")),
  heroSubtitleEn: z.string().trim().max(300).optional().or(z.literal("")),
  addressEn: z.string().trim().max(300).optional().or(z.literal("")),
  copyrightEn: z.string().trim().max(300).optional().or(z.literal("")),
  seoTitleEn: z.string().trim().max(70, "عنوان سئو بهتر است حداکثر ۷۰ حرف باشد").optional().or(z.literal("")),
  seoDescriptionEn: z
    .string()
    .trim()
    .max(160, "توضیحات سئو بهتر است حداکثر ۱۶۰ حرف باشد")
    .optional()
    .or(z.literal("")),
  maintenanceMode: z.boolean().default(false),
  // Bank details for the /support payment block. The transforms normalize
  // before validating, so a supporter's card number typed with Persian digits
  // or spaces ("۶۰۳۷ ۹۹۷۷ ...") is stored as 16 bare Latin digits. Running the
  // same lib/bank helpers here and in the server action means a value can
  // never pass client-side validation and then fail on the server.
  supportPaymentEnabled: z.boolean().default(false),
  supportCardNumber: z
    .string()
    .optional()
    .transform((value) => normalizeCardNumber(value ?? ""))
    .refine(
      (value) => value === "" || isValidCardNumber(value),
      "شماره کارت باید ۱۶ رقم و معتبر باشد",
    ),
  supportCardHolder: z.string().trim().max(100).optional().or(z.literal("")),
  supportSheba: z
    .string()
    .optional()
    .transform((value) => normalizeSheba(value ?? ""))
    .refine(
      (value) => value === "" || isValidSheba(value),
      "شماره شبا معتبر نیست (IR و ۲۴ رقم)",
    ),
})
  /**
   * Turning the block on with no card details would render an empty payment
   * box on the public page, so the toggle is only allowed up once there is
   * something to show. The issue is attached to the offending field rather
   * than the checkbox so the admin sees which value is missing. SHEBA stays
   * optional — card-to-card is the common case.
   */
  .superRefine((data, ctx) => {
    if (!data.supportPaymentEnabled) return;

    if (!data.supportCardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["supportCardNumber"],
        message: "برای فعال‌سازی بخش حمایت مالی، شماره کارت را وارد کنید.",
      });
    }
    if (!data.supportCardHolder) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["supportCardHolder"],
        message: "برای فعال‌سازی بخش حمایت مالی، نام صاحب کارت را وارد کنید.",
      });
    }
  });

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
export type SiteSettingsFormInput = z.input<typeof siteSettingsFormSchema>;
