import { auth } from "@/lib/auth";
import { ProfileForm } from "@/features/admin/components/ProfileForm";

export default async function AdminProfilePage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">پروفایل</h1>
        <p className="text-text-secondary">مدیریت اطلاعات حساب کاربری شما</p>
      </div>
      <div className="max-w-2xl">
        <ProfileForm
          name={session?.user?.name ?? ""}
          email={session?.user?.email ?? ""}
        />
      </div>
    </div>
  );
}
