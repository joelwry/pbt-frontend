import { MemberDetailView } from "@/features/admin-members/components/member-detail-view";

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  return <MemberDetailView memberId={memberId} />;
}
