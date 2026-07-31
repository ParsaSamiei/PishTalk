import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditFaqForm } from "@/features/admin/components/EditFaqForm";

interface EditFaqPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });

  if (!faq) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">ویرایش سوال</h1>
      </div>
      {/* Prisma returns the optional English columns as `null`, while the
          form's schema types them as optional strings — coalesce at the
          boundary so an untranslated FAQ renders empty inputs. */}
      <EditFaqForm
        faqId={faq.id}
        defaultValues={{
          ...faq,
          questionEn: faq.questionEn ?? "",
          answerEn: faq.answerEn ?? "",
        }}
      />
    </div>
  );
}
