import type { Metadata } from "next";
import { AdminUsersView } from "@/features/admin-users/components/admin-users-view";

export const metadata: Metadata = {
  title: "Admin Users & Roles | PBT Admin",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
