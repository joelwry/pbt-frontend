import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_TIERS, TIER_ORDER } from "@/features/membership/tiers";
import type { MembershipTier } from "@/features/session/types";

export function TierComparisonCard({ currentTier }: { currentTier: MembershipTier }) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Compare Tiers</h3>
      <ul className="space-y-3">
        {TIER_ORDER.map((tier) => {
          const def = MEMBERSHIP_TIERS[tier];
          const isCurrent = tier === currentTier;
          return (
            <li
              key={tier}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-2.5 py-2",
                isCurrent && "bg-sky-tint"
              )}
            >
              <Badge variant={isCurrent ? "sky" : "outline"}>{def.label}</Badge>
              <span className="text-xs text-text-muted text-right">{def.contractLabel}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
