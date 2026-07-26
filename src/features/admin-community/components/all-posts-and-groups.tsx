"use client";

import { useState } from "react";
import { MessageCircle, ThumbsUp, Users, Search, Pin, PinOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { useAllPosts, useCommunityGroups, useTogglePin } from "@/features/admin-community/hooks/use-admin-community";
import type { CommunityPostSummary } from "@/features/admin-community/types";

export function AllPostsCard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useAllPosts(search, page);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h3 className="font-display text-lg font-semibold text-text-primary">All Posts</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts by title"
            className="pl-10"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No posts yet" />
      ) : (
        <>
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            {data.items.map((post, i) => (
              <div key={post.id}>
                <PostRow post={post} />
                {i < data.items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border flex-wrap gap-3">
            <p className="text-sm text-text-muted">
              Showing {data.items.length} of {data.pagination.totalItems}
            </p>
            <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </Card>
  );
}

function PostRow({ post }: { post: CommunityPostSummary }) {
  const { mutate: togglePin, isPending } = useTogglePin();

  return (
    <div className="py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-text-primary leading-snug">{post.title}</p>
            {post.pinned && (
              <Badge variant="outline">
                <Pin className="h-3 w-3" />
                Pinned
              </Badge>
            )}
          </div>
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
        <button
          onClick={() => togglePin(post.id)}
          disabled={isPending}
          className="shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-[#F5F8FA] hover:text-sky-600 disabled:opacity-50"
          aria-label={post.pinned ? `Unpin ${post.title}` : `Pin ${post.title}`}
        >
          {post.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
      </div>
    </div>
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
        <EmptyState icon={Users} title="No groups yet" description="Community Groups are coming soon." />
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
