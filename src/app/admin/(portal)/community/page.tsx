import type { Metadata } from "next";
import { CommunityManagementView } from "@/features/admin-community/components/community-management-view";

export const metadata: Metadata = {
  title: "Community Management | PBT Admin",
};

export default function AdminCommunityPage() {
  return <CommunityManagementView />;
}
