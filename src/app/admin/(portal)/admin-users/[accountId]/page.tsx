import { AdminUserEditorView } from "@/features/admin-users/components/admin-user-editor-view";

export default async function AdminUserEditorPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  return <AdminUserEditorView accountId={accountId} />;
}
