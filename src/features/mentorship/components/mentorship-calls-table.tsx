"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { useMentorshipCalls } from "@/features/mentorship/hooks/use-mentorship";
import { BookCallDialog } from "@/features/mentorship/components/book-call-dialog";
import type { CallStatus } from "@/features/mentorship/types";

const STATUS_VARIANT: Record<CallStatus, "success" | "sky" | "error"> = {
  Confirmed: "success",
  Scheduled: "sky",
  Cancelled: "error",
};

export function MentorshipCallsTable({ mentorName }: { mentorName: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useMentorshipCalls(page);

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-text-primary">Upcoming Mentorship Calls</h3>
        <BookCallDialog mentorName={mentorName} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No calls booked yet" description="Book your first mentorship call to get started." />
      ) : (
        <>
          <div className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 pr-4">Topic</th>
                  <th className="py-2.5 pr-4">Mentor</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((call) => (
                  <tr key={call.id}>
                    <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{call.dateLabel}</td>
                    <td className="py-3 pr-4 text-text-primary font-medium">{call.topic}</td>
                    <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{call.mentorName}</td>
                    <td className="py-3">
                      <Badge variant={STATUS_VARIANT[call.status]}>{call.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </Card>
  );
}
