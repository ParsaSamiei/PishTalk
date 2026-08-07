import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EditSponsorForm } from "@/features/admin/components/EditSponsorForm";

interface EditSponsorPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function EditSponsorPage({ params }: EditSponsorPageProps) {
  const { id } = await params;
  const sponsor = await prisma.sponsor.findUnique({ where: { id } });

  if (!sponsor) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">ویرایش حامی</h1>
      <EditSponsorForm
        sponsorId={sponsor.id}
        defaultValues={{
          name: sponsor.name,
          logo: sponsor.logo ?? "",
          url: sponsor.url ?? "",
          description: sponsor.description ?? "",
          descriptionEn: sponsor.descriptionEn ?? "",
          sortOrder: sponsor.sortOrder,
          published: sponsor.published,
        }}
      />
    </div>
  );
}
