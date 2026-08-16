import type { Metadata } from "next";
import { AdminUsersView } from "@/features/admin-users/components/admin-users-view";
import type { AdminRole } from "@/features/admin-auth/types";

export const metadata: Metadata = {
  title: "Admin Users & Roles | PBT Admin",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  return <AdminUsersView initialRole={role as AdminRole | undefined} />;
}
