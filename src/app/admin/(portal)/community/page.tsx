import type { Metadata } from "next";
import { CommunityManagementView } from "@/features/admin-community/components/community-management-view";
import type { CommunityTab } from "@/features/admin-community/types";

export const metadata: Metadata = {
  title: "Community Management | PBT Admin",
};

export default async function AdminCommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <CommunityManagementView initialTab={tab as CommunityTab | undefined} />;
}
