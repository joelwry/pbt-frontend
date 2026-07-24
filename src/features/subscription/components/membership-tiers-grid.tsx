import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_TIERS, TIER_ORDER } from "@/features/membership/tiers";
import type { MembershipTier } from "@/features/session/types";

export function MembershipTiersGrid({ currentTier }: { currentTier: MembershipTier }) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Membership Tiers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TIER_ORDER.map((tier) => {
          const def = MEMBERSHIP_TIERS[tier];
          const isCurrent = tier === currentTier;
          return (
            <Card key={tier} className={cn(isCurrent && "border-2 border-orange-500")}>
              {isCurrent && (
                <Badge variant="orange" className="mb-3">
                  Current Plan
                </Badge>
              )}
              <Badge variant={isCurrent ? "sky" : "outline"} className="mb-3 ml-2 first:ml-0">
                {def.label}
              </Badge>
              <p className="font-display text-2xl font-bold text-text-primary">{def.priceLabel.split("/")[0]}</p>
              <p className="text-xs text-text-muted mt-0.5">/{def.priceLabel.split("/")[1]}</p>
              <p className="text-xs text-text-muted mt-3">{def.contractLabel}</p>
              <ul className="space-y-2 mt-4">
                {def.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
