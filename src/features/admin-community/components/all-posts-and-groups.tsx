"use client";

import { MessageCircle, ThumbsUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useAllPosts, useCommunityGroups } from "@/features/admin-community/hooks/use-admin-community";

export function AllPostsCard() {
  const { data: posts, isLoading } = useAllPosts();

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">All Posts</h3>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !posts || posts.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No posts yet" />
      ) : (
        <div>
          {posts.map((post, i) => (
            <div key={post.id}>
              <div className="py-3.5">
                <p className="text-sm font-semibold text-text-primary leading-snug">{post.title}</p>
                <p className="text-xs text-text-muted mt-1">
                  {post.authorName} · {post.postedAtLabel}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.replyCount} replies
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {post.likeCount}
                  </span>
                </div>
              </div>
              {i < posts.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function GroupsCard() {
  const { data: groups, isLoading } = useCommunityGroups();

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Community Groups</h3>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !groups || groups.length === 0 ? (
        <EmptyState icon={Users} title="No groups yet" />
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center justify-between gap-3 py-1.5">
              <div>
                <p className="text-sm font-semibold text-text-primary">{group.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{group.memberCount} members</p>
              </div>
              <Badge variant={group.status === "Active" ? "success" : "outline"}>{group.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
