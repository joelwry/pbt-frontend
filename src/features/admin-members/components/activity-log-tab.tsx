"use client";

import { useState } from "react";
import { GraduationCap, MessageSquare, Ticket, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { cn } from "@/lib/utils";
import type { AdminMemberDetail } from "@/features/admin-members/types";

const ACTIVITY_ICON = { lesson: GraduationCap, community: MessageSquare, event: Ticket };
const ACTIVITY_ICON_BG = {
  lesson: "bg-sky-tint text-sky-600",
  community: "bg-orange-tint text-orange-500",
  event: "bg-[#F1F5F9] text-slate-500",
};

const PAGE_SIZE = 5;

export function ActivityLogTab({ member }: { member: AdminMemberDetail }) {
  const [page, setPage] = useState(1);
  const log = member.recentActivity;
  const totalPages = Math.max(1, Math.ceil(log.length / PAGE_SIZE));
  const pageItems = log.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Activity Log</h3>
      {log.length === 0 ? (
        <EmptyState icon={History} title="No activity yet" description="Lesson completions, community posts and event RSVPs will show up here." />
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
}
