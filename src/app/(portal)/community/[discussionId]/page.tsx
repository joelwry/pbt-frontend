import { DiscussionDetailView } from "@/features/community/components/discussion-detail-view";

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) {
  const { discussionId } = await params;
  return <DiscussionDetailView discussionId={discussionId} />;
}
