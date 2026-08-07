import { z } from "zod";

export const sponsorFormSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد").max(150),
  // Logo is optional: a supporter can be listed by name alone.
  logo: z.string().trim().max(500).optional().or(z.literal("")),
  url: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^https?:\/\//.test(value),
      "آدرس باید با http:// یا https:// شروع شود",
    ),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  descriptionEn: z.string().trim().max(500).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type SponsorFormValues = z.infer<typeof sponsorFormSchema>;
