import { PageHeader } from "@/components/shared/page-header";
import { RestrictedAccessBanner } from "@/features/admin-staff-dashboard/components/restricted-access-banner";
import { ContentManagerDashboard } from "@/features/admin-staff-dashboard/components/content-manager-dashboard";
import { GenericStaffDashboard } from "@/features/admin-staff-dashboard/components/generic-staff-dashboard";
import type { AdminUser } from "@/features/admin-auth/types";

export function StaffDashboardView({ admin }: { admin: AdminUser }) {
  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome back, ${admin.fullName.split(" ")[0]} 👋`} description="Here's what's relevant to your role today." />

      <RestrictedAccessBanner admin={admin} />

      {admin.role === "CONTENT_MANAGER" ? <ContentManagerDashboard /> : <GenericStaffDashboard admin={admin} />}
    </div>
  );
}
