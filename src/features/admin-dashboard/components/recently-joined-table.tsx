import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIER_LABEL, TIER_VARIANT } from "@/features/admin-members/tier-labels";
import type { AdminRecentMember } from "@/features/admin-dashboard/types";

const STATUS_VARIANT = {
  Active: "success" as const,
  "Payment Failed": "error" as const,
  Paused: "outline" as const,
};

export function RecentlyJoinedTable({ members }: { members: AdminRecentMember[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-text-primary">Recently Joined</h3>
        <Link href="/admin/members" className="text-sm font-semibold text-sky-600 hover:underline">
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
              <th className="py-2.5 pr-4">Member</th>
              <th className="py-2.5 pr-4">Tier</th>
              <th className="py-2.5 pr-4">Joined</th>
              <th className="py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary truncate">{member.fullName}</p>
                      <p className="text-xs text-text-muted truncate">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={TIER_VARIANT[member.tier]}>{TIER_LABEL[member.tier]}</Badge>
                </td>
                <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{member.joinedLabel}</td>
                <td className="py-3">
                  <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
