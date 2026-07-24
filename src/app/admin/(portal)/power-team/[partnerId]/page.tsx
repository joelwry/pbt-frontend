import { PartnerEditorView } from "@/features/admin-power-team/components/partner-editor-view";

export default async function AdminPartnerEditorPage({
  params,
}: {
  params: Promise<{ partnerId: string }>;
}) {
  const { partnerId } = await params;
  return <PartnerEditorView partnerId={partnerId} />;
}
