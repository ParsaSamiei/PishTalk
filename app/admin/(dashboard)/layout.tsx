import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminTopbar } from "@/features/admin/components/AdminTopbar";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "مدیر",
  SUPER_ADMIN: "مدیر ارشد",
  EDITOR: "ویرایشگر",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const role = session.user.role;

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar
          userName={session.user.name ?? session.user.email ?? "مدیر"}
          userRole={role ? ROLE_LABELS[role] : undefined}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
