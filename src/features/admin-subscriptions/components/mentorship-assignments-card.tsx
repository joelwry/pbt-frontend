"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserRoundCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { useMentorshipMembers, useAssignMentor } from "@/features/admin-subscriptions/hooks/use-admin-subscriptions";
import { adminLeadersService } from "@/features/admin-leaders/services/admin-leaders.service";

function LeaderSelect({ value, onAssign }: { value: string | null; onAssign: (leaderId: string | null) => void }) {
  const { data } = useQuery({
    queryKey: ["admin", "leaders", "list", "All", "", 1, "assign-mentor-dropdown"],
    queryFn: () => adminLeadersService.getLeadersPage({ region: "All", search: "", page: 1, limit: 100 }),
  });
  const activeLeaders = (data?.items ?? []).filter((l) => l.status === "Active");

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onAssign(e.target.value || null)}
      className="h-9 rounded-[var(--radius-input)] border border-border bg-white px-2.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      <option value="">Unassigned</option>
      {activeLeaders.map((leader) => (
        <option key={leader.id} value={leader.id}>
          {leader.fullName}
        </option>
      ))}
    </select>
  );
}

export function MentorshipAssignmentsCard() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useMentorshipMembers(page);
  const { mutate: assign } = useAssignMentor();

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg font-semibold text-text-primary">Mentorship Assignments</h3>
      </div>
      <p className="text-sm text-text-muted mb-5">Assign a PBT Leader to each Mentorship-tier member.</p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={UserRoundCog} title="No Mentorship members yet" description="Members on the Mentorship tier will appear here for mentor assignment." />
      ) : (
        <>
          <div className={`space-y-1 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
            {data.items.map((member) => (
              <div key={member.userId} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{member.memberName}</p>
                  <p className="text-xs text-text-muted truncate">{member.memberEmail}</p>
                </div>
                <LeaderSelect
                  value={member.assignedLeaderId}
                  onAssign={(leaderId) => assign({ userId: member.userId, leaderId })}
                />
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </Card>
  );
}
