"use client";

import Link from "next/link";
import { Flag, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useFlaggedPosts, useApprovePost, useRemovePost } from "@/features/admin-community/hooks/use-admin-community";
import type { FlaggedPost } from "@/features/admin-community/types";

export function FlaggedForReviewCard() {
  const { data: posts, isLoading } = useFlaggedPosts();

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg font-semibold text-text-primary">Flagged for Review</h3>
        {posts && posts.length > 0 && <Badge variant="error">{posts.length} pending</Badge>}
      </div>
      <p className="text-sm text-text-muted mb-5">Posts reported by members, awaiting moderation.</p>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : !posts || posts.length === 0 ? (
        <EmptyState icon={Flag} title="Nothing flagged" description="The moderation queue is clear." />
      ) : (
        <div>
          {posts.map((post, i) => (
            <div key={post.id}>
              <FlaggedPostRow post={post} />
              {i < posts.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function FlaggedPostRow({ post }: { post: FlaggedPost }) {
  const { mutate: approve, isPending: isApproving } = useApprovePost();
  const { mutate: remove, isPending: isRemoving } = useRemovePost();
  const { toast } = useToast();

  return (
    <div>
      <Link
        href={`/admin/community/${post.id}`}
        className="text-sm font-semibold text-text-primary leading-snug hover:text-sky-600 hover:underline"
      >
        {post.postTitle}
      </Link>
      <p className="text-sm text-text-secondary mt-1.5 italic">&ldquo;{post.quote}&rdquo;</p>
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <span className="text-xs text-text-muted">
          Reported by {post.reportedByCount} member{post.reportedByCount === 1 ? "" : "s"}
        </span>
        <Badge variant="orange">{post.reason}</Badge>
      </div>
      <p className="text-xs text-text-muted mt-1.5">
        Posted by {post.postedByName} · {post.timeAgoLabel}
      </p>

      <div className="flex items-center gap-2.5 mt-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={isApproving}
          onClick={() =>
            approve(post.id, {
              onSuccess: () => toast({ variant: "success", title: "Post approved", description: "It remains visible in the community." }),
            })
          }
        >
          {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          Approve
        </Button>
        <Button
          variant="danger"
          size="sm"
          disabled={isRemoving}
          onClick={() =>
            remove(post.id, {
              onSuccess: () => toast({ variant: "info", title: "Post removed", description: "It's no longer visible in the community." }),
            })
          }
        >
          {isRemoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Remove
        </Button>
      </div>
    </div>
  );
}
