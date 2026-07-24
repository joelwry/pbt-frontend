import Link from "next/link";
import { Award, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import type { LeaderSpotlight, CommunityGroup } from "@/features/community/types";

export function LeaderSpotlightCard({ leader }: { leader: LeaderSpotlight | null }) {
  if (!leader) {
    return (
      <Card>
        <h3 className="font-display text-base font-semibold text-text-primary mb-4">Leader Spotlight</h3>
        <EmptyState icon={Award} title="No spotlight this week" />
      </Card>
    );
  }

  return (
    <Card className="text-center">
      <h3 className="font-display text-base font-semibold text-text-primary mb-4 text-left">Leader Spotlight</h3>
      <div className="h-16 w-16 rounded-full bg-orange-500 text-white text-lg font-bold flex items-center justify-center mx-auto">
        {leader.initials}
      </div>
      <p className="font-semibold text-text-primary mt-3">{leader.name}</p>
      <p className="text-xs text-text-muted mt-0.5">{leader.groupLabel}</p>
      <Badge variant="orange" className="mt-3">
        <Award className="h-3 w-3" />
        {leader.badgeLabel}
      </Badge>
    </Card>
  );
}

export function YourGroupsCard({ groups }: { groups: CommunityGroup[] }) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Your Groups</h3>
      {groups.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="You haven't joined any groups yet" />
      ) : (
        <ul className="space-y-3.5">
          {groups.map((group) => (
            <li key={group.id} className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-text-primary">{group.name}</span>
              {group.membership === "Member" ? (
                <Badge variant="sky">Member</Badge>
              ) : (
                <Button variant="secondary" size="sm">
                  Join
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function CommunityGuidelinesCard({ guidelinesUrl }: { guidelinesUrl: string }) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-2">Community Guidelines</h3>
      <p className="text-sm text-text-muted leading-relaxed">
        Keep discussions respectful, on-topic, and free from external promotion. Posts are reviewed by PBT Admin.
      </p>
      <Link href={guidelinesUrl} className="inline-block text-sm font-semibold text-sky-600 mt-3 hover:underline">
        Read full guidelines →
      </Link>
    </Card>
  );
}
