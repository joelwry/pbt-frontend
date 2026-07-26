"use client";

import { useState } from "react";
import { MessageCircle, Send, ThumbsUp, Flag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { BackLink } from "@/components/shared/back-link";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/providers/toast-provider";
import { useDiscussion, useToggleLike, useAddReply, useReportDiscussion } from "@/features/community/hooks/use-community";

const ROLE_BADGE_VARIANT = {
  "PBT Leader": "orange" as const,
  "Power Team": "sky" as const,
  "PBT Plus": "success" as const,
  "PBT Mentorship": "navy" as const,
};

const REPORT_REASONS = [
  "Suspected spam / external promotion",
  "Reported as misleading / inaccurate",
  "Harassment or abusive language",
  "Other",
];

export function DiscussionDetailView({ discussionId }: { discussionId: string }) {
  const { data: discussion, isLoading, isError, refetch } = useDiscussion(discussionId);
  const { mutate: toggleLike, isPending: isLiking } = useToggleLike(discussionId);
  const { mutate: addReply, isPending: isReplying } = useAddReply(discussionId);
  const { mutate: reportDiscussion, isPending: isReporting } = useReportDiscussion(discussionId);
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (isError || !discussion) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    addReply(message.trim(), { onSuccess: () => setMessage("") });
  }

  return (
    <div className="space-y-6">
      <BackLink href="/community" label="Back to Community" />

      <PageHeader title={discussion.title} />

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {discussion.authorInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">{discussion.authorName}</span>
              {discussion.roleTag && <Badge variant={ROLE_BADGE_VARIANT[discussion.roleTag]}>{discussion.roleTag}</Badge>}
            </div>
            <span className="text-xs text-text-muted">{discussion.postedAtLabel}</span>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{discussion.fullBody}</p>

        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
          <Button
            variant={discussion.likedByMe ? "primary" : "secondary"}
            size="sm"
            onClick={() => toggleLike()}
            disabled={isLiking}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {discussion.likedByMe ? "Liked" : "Like"} · {discussion.likeCount}
          </Button>
          <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <MessageCircle className="h-3.5 w-3.5" />
            {discussion.replyCount} {discussion.replyCount === 1 ? "reply" : "replies"}
          </span>

          <Dialog open={reportOpen} onOpenChange={setReportOpen}>
            <button
              onClick={() => setReportOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-error"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report this post</DialogTitle>
                <DialogDescription>Let the PBT team know why this post needs a review.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    disabled={isReporting}
                    onClick={() =>
                      reportDiscussion(reason, {
                        onSuccess: () => {
                          setReportOpen(false);
                          toast({ variant: "success", title: "Report submitted", description: "Thanks — our team will review this." });
                        },
                      })
                    }
                    className="w-full text-left rounded-[var(--radius-input)] border border-border px-3.5 py-2.5 text-sm text-text-primary hover:bg-[#F5F8FA] disabled:opacity-50"
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <DialogClose asChild>
                <Button variant="secondary" className="w-full mt-2">
                  Cancel
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-base font-semibold text-text-primary mb-4">Replies</h3>

        {discussion.replies.length === 0 ? (
          <EmptyState icon={MessageCircle} title="No replies yet" description="Be the first to respond." />
        ) : (
          <div className="space-y-4 mb-5">
            {discussion.replies.map((reply, i) => (
              <div key={reply.id}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-sky-tint text-sky-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {reply.authorInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-text-primary">{reply.authorName}</span>
                      {reply.roleTag && <Badge variant={ROLE_BADGE_VARIANT[reply.roleTag]}>{reply.roleTag}</Badge>}
                      <span className="text-xs text-text-muted">{reply.postedAtLabel}</span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">{reply.message}</p>
                  </div>
                </div>
                {i < discussion.replies.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleReplySubmit} className="flex items-start gap-3 pt-4 border-t border-border">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Write a reply…"
            className="flex-1 rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          />
          <Button type="submit" size="icon" disabled={isReplying || !message.trim()} aria-label="Send reply">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
