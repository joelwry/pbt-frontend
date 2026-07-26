import { Crown, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_BADGE } from "@/features/session/membership-badge";
import type { SubscriptionSummary } from "@/features/subscription/types";

export function SubscriptionHeroCard({ subscription }: { subscription: SubscriptionSummary }) {
  const badge = MEMBERSHIP_BADGE[subscription.tier];

  return (
    <Card className="bg-linear-to-r from-navy-950 to-sky-600 border-none">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Badge variant="orange" className="mb-3">
            <Crown className="h-3 w-3" />
            {badge.label}
          </Badge>
          <h3 className="font-display text-lg font-bold text-white">
            {subscription.cancelled ? "Your membership is set to cancel" : "Your membership is active"}
          </h3>
          <p className="text-sm text-white/70 mt-1">{subscription.contractLabel}</p>
          {subscription.cancelled && (
            <p className="inline-flex items-center gap-1.5 text-xs text-orange-500 font-semibold mt-2">
              <AlertCircle className="h-3.5 w-3.5" />
              You&apos;ll keep access until {subscription.nextBillingLabel}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">Client ID</p>
          <p className="font-display text-base font-bold text-white mt-1">{subscription.clientId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">
            {subscription.cancelled ? "Access Until" : "Next Billing"}
          </p>
          <p className="text-sm font-semibold text-white mt-1">{subscription.nextBillingLabel}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">Amount</p>
          <p className="text-sm font-semibold text-white mt-1">{subscription.amountLabel}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">Payment Method</p>
          <p className="text-sm font-semibold text-white mt-1">{subscription.paymentMethodLabel}</p>
        </div>
      </div>
    </Card>
  );
}
