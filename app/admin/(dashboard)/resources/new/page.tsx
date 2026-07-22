import { prisma } from "@/lib/prisma";
import { NewResourceForm } from "@/features/admin/components/NewResourceForm";

export default async function NewResourcePage() {
  const events = await prisma.event.findMany({
    where: { deletedAt: null },
    orderBy: { date: "desc" },
    select: { id: true, title: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">منبع جدید</h1>
      <NewResourceForm events={events} />
    </div>
  );
}
