import Link from "next/link";
import { MessageSquare, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { CommunityActivityItem } from "@/features/dashboard/types";

export function CommunityActivityCard({ items }: { items: CommunityActivityItem[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-text-primary">Community Activity</h3>
        <Link href="/community" className="text-xs font-semibold text-sky-600 hover:underline">
          View all →
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No recent activity" description="Community posts will show up here." />
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const Icon = item.kind === "announcement" ? Megaphone : MessageSquare;
            return (
              <li key={item.id} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-sky-tint text-sky-600 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-text-primary leading-snug">
                    <span className="font-semibold">{item.authorName}</span> {item.message}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{item.timeAgoLabel}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/community"
        className="mt-5 flex items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-sm font-semibold text-text-primary hover:bg-[#F5F8FA] transition-colors"
      >
        Go to Community →
      </Link>
    </Card>
  );
}
