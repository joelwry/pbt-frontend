"use client";

import { MessageCircle, ThumbsUp, Flag, CheckCircle2, Trash2, Pin, PinOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/shared/back-link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { useToast } from "@/providers/toast-provider";
import {
  usePostDetail,
  useTogglePin,
  useApprovePost,
  useRemovePost,
} from "@/features/admin-community/hooks/use-admin-community";

export function PostDetailView({ postId }: { postId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: post, isLoading, isError, refetch } = usePostDetail(postId);
  const { mutate: togglePin, isPending: isPinning } = useTogglePin();
  const { mutate: approve, isPending: isApproving } = useApprovePost();
  const { mutate: remove, isPending: isRemoving } = useRemovePost();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <Card>
          <Skeleton className="h-6 w-2/3 mb-4" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  if (isError || !post) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <BackLink href="/admin/community" label="Back to Community" />

      <Card>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl font-semibold text-text-primary">{post.title}</h1>
              {post.pinned && (
                <Badge variant="outline">
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
              {post.reportCount > 0 && <Badge variant="error">{post.reportCount} reports</Badge>}
            </div>
            <p className="text-sm text-text-muted mt-1">
              {post.authorName} · {post.postedAtLabel}
            </p>
          </div>
        </div>

        <p className="text-sm text-text-secondary whitespace-pre-wrap mt-5">{post.content}</p>

        <div className="flex items-center gap-4 mt-5">
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.replies.length} replies
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <ThumbsUp className="h-3.5 w-3.5" />
            {post.likeCount} likes
          </span>
          {post.reportCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
              <Flag className="h-3.5 w-3.5" />
              {post.reportReason || "No reason given"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 mt-5 pt-5 border-t border-border flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            disabled={isPinning}
            onClick={() => togglePin(post.id)}
          >
            {isPinning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : post.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            {post.pinned ? "Unpin" : "Pin"}
          </Button>
          {post.reportCount > 0 && (
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
          )}
          <Button
            variant="danger"
            size="sm"
            disabled={isRemoving}
            onClick={() =>
              remove(post.id, {
                onSuccess: () => {
                  toast({ variant: "info", title: "Post removed", description: "It's no longer visible in the community." });
                  router.push("/admin/community");
                },
              })
            }
          >
            {isRemoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Remove
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-base font-semibold text-text-primary mb-4">
          Replies ({post.replies.length})
        </h2>
        {post.replies.length === 0 ? (
          <p className="text-sm text-text-muted">No replies yet.</p>
        ) : (
          <div>
            {post.replies.map((reply, i) => (
              <div key={reply.id}>
                <div className="py-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-text-primary">{reply.authorName}</p>
                    {reply.roleTag && <Badge variant="outline">{reply.roleTag}</Badge>}
                    <span className="text-xs text-text-muted">{reply.postedAtLabel}</span>
                  </div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap mt-1.5">{reply.message}</p>
                </div>
                {i < post.replies.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
