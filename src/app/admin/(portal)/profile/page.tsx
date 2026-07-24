import type { Metadata } from "next";
import { AdminProfileView } from "@/features/admin-profile/components/admin-profile-view";

export const metadata: Metadata = {
  title: "Profile & Settings | PBT Admin",
};

export default function AdminProfilePage() {
  return <AdminProfileView />;
}
