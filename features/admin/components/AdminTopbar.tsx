import { LogOut } from "lucide-react";

import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { MobileAdminNav } from "@/features/admin/components/MobileAdminNav";

interface AdminTopbarProps {
  readonly userName: string;
  readonly userRole?: string;
}

function AdminTopbar({ userName, userRole }: AdminTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <MobileAdminNav />
      <div className="flex items-center gap-4">
        <div className="text-end">
          <p className="text-sm font-medium text-text-primary">{userName}</p>
          {userRole ? <p className="text-xs text-text-light">{userRole}</p> : null}
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <Button type="submit" variant="ghost" size="icon" aria-label="خروج">
            <LogOut className="size-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </header>
  );
}

export { AdminTopbar };
