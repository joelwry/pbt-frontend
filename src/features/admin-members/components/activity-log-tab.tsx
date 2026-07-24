"use client";

import { useState } from "react";
import { GraduationCap, MessageSquare, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/shared/pagination";
import { cn } from "@/lib/utils";
import type { AdminMemberDetail } from "@/features/admin-members/types";

const ACTIVITY_ICON = { lesson: GraduationCap, community: MessageSquare, event: Ticket };
const ACTIVITY_ICON_BG = {
  lesson: "bg-sky-tint text-sky-600",
  community: "bg-orange-tint text-orange-500",
  event: "bg-[#F1F5F9] text-slate-500",
};
const TIME_LABELS = ["2 days ago", "4 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago"];

const PAGE_SIZE = 5;

export function ActivityLogTab({ member }: { member: AdminMemberDetail }) {
  const [page, setPage] = useState(1);

  // Extends the 3-item preview into a fuller log for demo purposes by
  // cycling the same activity types with different timestamps.
  const fullLog = Array.from({ length: 14 }, (_, i) => {
    const base = member.recentActivity[i % member.recentActivity.length];
    return { ...base, id: `${base.id}_${i}`, timeAgoLabel: TIME_LABELS[i % TIME_LABELS.length] };
  });

  const totalPages = Math.max(1, Math.ceil(fullLog.length / PAGE_SIZE));
  const pageItems = fullLog.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Activity Log</h3>
      <ul className="space-y-4">
        {pageItems.map((item) => {
          const Icon = ACTIVITY_ICON[item.icon];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", ACTIVITY_ICON_BG[item.icon])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text-primary">{item.description}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.timeAgoLabel}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-5" />
    </Card>
  );
}
