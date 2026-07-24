import { ResourceEditorView } from "@/features/admin-resources/components/resource-editor-view";

export default async function AdminResourceEditorPage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  return <ResourceEditorView resourceId={resourceId} />;
}
