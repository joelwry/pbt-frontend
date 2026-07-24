import { EventEditorView } from "@/features/admin-events/components/event-editor-view";

export default async function AdminEventEditorPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <EventEditorView eventId={eventId} />;
}
