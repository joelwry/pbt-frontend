import { CheckCircle2, Clock, Calendar, CreditCard } from "lucide-react";
import { StatCard } from "@/features/dashboard/components/stat-card";
import type { AdminMemberDetail } from "@/features/admin-members/types";

export function MemberDetailStatsRow({ member }: { member: AdminMemberDetail }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={CheckCircle2}
        iconVariant="navy"
        value={String(member.lessonsCompleted)}
        label="Lessons Completed"
        linkLabel="View progress"
        linkHref={`/admin/members/${member.id}?tab=learning`}
      />
      <StatCard
        icon={Clock}
        iconVariant="navy"
        value={member.studyHours.toString()}
        label="Study Hours"
        linkLabel="View timeline"
        linkHref={`/admin/members/${member.id}?tab=learning`}
      />
      <StatCard
        icon={Calendar}
        iconVariant="orange"
        value={member.memberSinceLabel}
        label="Member Since"
        linkLabel="View billing"
        linkHref={`/admin/members/${member.id}?tab=billing`}
      />
      <StatCard
        icon={CreditCard}
        iconVariant="slate"
        value={member.contractTypeLabel}
        label="Contract Type"
        linkLabel="View billing"
        linkHref={`/admin/members/${member.id}?tab=billing`}
      />
    </div>
  );
}
