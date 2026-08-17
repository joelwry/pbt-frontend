import { PostDetailView } from "@/features/admin-community/components/post-detail-view";

export default async function AdminCommunityPostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostDetailView postId={postId} />;
}
