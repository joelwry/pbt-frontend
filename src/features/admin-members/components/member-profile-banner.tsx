import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminMemberDetail } from "@/features/admin-members/types";

const TIER_VARIANT = { Pathway: "outline" as const, Plus: "sky" as const, Mentorship: "orange" as const };
const STATUS_VARIANT = { Active: "success" as const, "Payment Failed": "error" as const, Paused: "outline" as const };

export function MemberProfileBanner({ member }: { member: AdminMemberDetail }) {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Member Management
      </Link>

      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-orange-500 text-white text-xl font-bold flex items-center justify-center shrink-0">
              {member.initials}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-text-primary">{member.fullName}</h2>
              <p className="text-sm text-text-muted mt-0.5">
                {member.email} · Client ID {member.clientId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={TIER_VARIANT[member.tier]}>PBT {member.tier}</Badge>
            <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
            <Button variant="secondary" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
