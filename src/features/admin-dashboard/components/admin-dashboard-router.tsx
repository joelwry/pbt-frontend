"use client";

import { AdminDashboardView } from "@/features/admin-dashboard/components/admin-dashboard-view";
import { StaffDashboardView } from "@/features/admin-staff-dashboard/components/staff-dashboard-view";
import { useAdminAuth } from "@/providers/admin-auth-provider";
import { Loader2 } from "lucide-react";

export function AdminDashboardRouter() {
  const { admin } = useAdminAuth();

  if (!admin) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
      </div>
    );
  }

  return admin.role === "SUPER_ADMIN" ? <AdminDashboardView /> : <StaffDashboardView admin={admin} />;
}
