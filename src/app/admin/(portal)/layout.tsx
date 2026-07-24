import { RequireAdminAuth } from "@/components/admin-layout/require-admin-auth";
import { AdminPortalShell } from "@/components/admin-layout/admin-portal-shell";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdminAuth>
      <AdminPortalShell>{children}</AdminPortalShell>
    </RequireAdminAuth>
  );
}
