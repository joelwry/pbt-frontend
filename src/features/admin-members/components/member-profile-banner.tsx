import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditMemberDialog } from "@/features/admin-members/components/edit-member-dialog";
import { TIER_LABEL, TIER_VARIANT } from "@/features/admin-members/tier-labels";
import type { AdminMemberDetail } from "@/features/admin-members/types";

const STATUS_VARIANT = { Active: "success" as const, "Payment Failed": "error" as const, Paused: "outline" as const };

export function MemberProfileBanner({ member }: { member: AdminMemberDetail }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-4">
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
            <Badge variant={TIER_VARIANT[member.tier]}>{TIER_LABEL[member.tier]}</Badge>
            <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
            {member.setupPending && <Badge variant="warning">Setup pending</Badge>}
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </Card>

      <EditMemberDialog member={member} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
