import { z } from "zod";

export const resourceFormSchema = z
  .object({
    title: z.string().trim().min(3, "عنوان باید حداقل ۳ حرف باشد").max(200),
    description: z.string().trim().max(500).optional().or(z.literal("")),
    // Optional English translations. Blank means "not translated yet" and the
    // public site falls back to the Persian text (lib/i18n/content.ts).
    titleEn: z.string().trim().max(200).optional().or(z.literal("")),
    descriptionEn: z.string().trim().max(500).optional().or(z.literal("")),
    resourceType: z.enum([
      "PDF",
      "PRESENTATION",
      "GITHUB",
      "VIDEO",
      "RESEARCH_PAPER",
      "EXTERNAL_LINK",
    ]),
    fileUrl: z.string().trim().url("آدرس فایل معتبر نیست").optional().or(z.literal("")),
    externalUrl: z.string().trim().url("آدرس لینک معتبر نیست").optional().or(z.literal("")),
    eventId: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => Boolean(data.fileUrl) || Boolean(data.externalUrl), {
    message: "حداقل یکی از آدرس فایل یا لینک خارجی الزامی است",
    path: ["externalUrl"],
  });

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
