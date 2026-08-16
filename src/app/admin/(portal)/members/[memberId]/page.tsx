import { MemberDetailView } from "@/features/admin-members/components/member-detail-view";
import type { MemberDetailTab } from "@/features/admin-members/components/member-detail-shared";

export default async function AdminMemberDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ memberId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { memberId } = await params;
  const { tab } = await searchParams;
  return <MemberDetailView memberId={memberId} initialTab={tab as MemberDetailTab | undefined} />;
}
