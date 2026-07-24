import { LeaderEditorView } from "@/features/admin-leaders/components/leader-editor-view";

export default async function AdminLeaderEditorPage({
  params,
}: {
  params: Promise<{ leaderId: string }>;
}) {
  const { leaderId } = await params;
  return <LeaderEditorView leaderId={leaderId} />;
}
