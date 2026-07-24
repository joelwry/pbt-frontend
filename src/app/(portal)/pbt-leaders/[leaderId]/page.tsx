import { LeaderDetailView } from "@/features/leaders/components/leader-detail-view";

export default async function LeaderDetailPage({
  params,
}: {
  params: Promise<{ leaderId: string }>;
}) {
  const { leaderId } = await params;
  return <LeaderDetailView leaderId={leaderId} />;
}
