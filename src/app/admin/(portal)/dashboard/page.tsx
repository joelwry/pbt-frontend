import type { Metadata } from "next";
import { AdminDashboardRouter } from "@/features/admin-dashboard/components/admin-dashboard-router";

export const metadata: Metadata = {
  title: "Dashboard | PBT Admin",
};

export default function AdminDashboardPage() {
  return <AdminDashboardRouter />;
}
