import Link from "next/link";
import { MessageCircle, ThumbsUp, Pin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { NewPostDialog } from "@/features/community/components/new-post-dialog";
import type { Discussion } from "@/features/community/types";

const ROLE_BADGE_VARIANT = {
  "PBT Leader": "orange" as const,
  "Power Team": "sky" as const,
  "PBT Plus": "success" as const,
  "PBT Mentorship": "navy" as const,
};

interface TrendingDiscussionsListProps {
  discussions: Discussion[];
  totalCount?: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function TrendingDiscussionsList({
  discussions,
  totalCount,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: TrendingDiscussionsListProps) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">Trending Discussions</h3>
          <p className="text-sm text-text-muted mt-1">Tap a post to open the full thread and reply.</p>
        </div>
        <NewPostDialog />
      </div>

      {discussions.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No discussions yet"
          description="Be the first to start a conversation in the PBT community."
          className="mt-6"
        />
      ) : (
        <div className="mt-5">
          {discussions.map((discussion, i) => (
            <div key={discussion.id}>
              <Link
                href={`/community/${discussion.id}`}
                className="block py-4 -mx-2 px-2 rounded-xl transition-colors hover:bg-[#F5F8FA]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-9 w-9 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {discussion.authorInitials}
                  </div>
                  <span className="text-sm font-semibold text-text-primary">{discussion.authorName}</span>
                  {discussion.roleTag && <Badge variant={ROLE_BADGE_VARIANT[discussion.roleTag]}>{discussion.roleTag}</Badge>}
                  {discussion.pinned && (
                    <Badge variant="outline">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <p className="font-semibold text-text-primary text-[15px] leading-snug">{discussion.title}</p>
                <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{discussion.excerpt}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {discussion.replyCount} replies
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {discussion.likeCount}
                  </span>
                </div>
              </Link>
              {i < discussions.length - 1 && <Separator />}
            </div>
          ))}

          <LoadMoreButton
            hasMore={hasMore}
            isLoading={isLoadingMore}
            onClick={onLoadMore}
            loadedLabel={totalCount ? `Showing ${discussions.length} of ${totalCount} discussions` : undefined}
          />
        </div>
      )}
    </Card>
  );
}
