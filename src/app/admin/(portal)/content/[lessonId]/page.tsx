import { ContentEditorView } from "@/features/admin-content/components/content-editor-view";

export default async function AdminContentEditorPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return <ContentEditorView lessonId={lessonId} />;
}
