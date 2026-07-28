import Link from "next/link";
import { CalendarClock, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tierMeetsRequirement } from "@/features/session/tier-rank";
import { MEMBERSHIP_TIERS } from "@/features/membership/tiers";
import type { MembershipTier } from "@/features/session/types";
import type { WorkshopsPromo } from "@/features/dashboard/types";

export function WorkshopsPromoCard({ promo, memberTier }: { promo: WorkshopsPromo; memberTier: MembershipTier }) {
  const hasAccess = tierMeetsRequirement(memberTier, promo.requiredTier);
  const requiredTierLabel = MEMBERSHIP_TIERS[promo.requiredTier].label;

  return (
    <Card className="relative overflow-hidden bg-linear-to-r from-navy-950 via-navy-900 to-sky-600 border-none !p-0">
      <div className="relative px-6 py-7 flex items-center justify-between gap-6 flex-wrap">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-navy-950 uppercase tracking-wide mb-3">
            <Sparkles className="h-3 w-3" />
            New
          </span>
          <h3 className="font-display text-xl font-bold text-white leading-snug">
            {promo.upcomingCount > 0
              ? `${promo.upcomingCount} upcoming ${promo.upcomingCount === 1 ? "workshop is" : "workshops are"} now open for booking!`
              : "New workshops are coming soon."}
          </h3>
          {promo.nextWorkshopTitle && (
            <p className="text-sm text-white/70 mt-2 flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              Next up: {promo.nextWorkshopTitle}
              {promo.nextWorkshopDateLabel ? ` — ${promo.nextWorkshopDateLabel}` : ""}
            </p>
          )}
        </div>

        {hasAccess ? (
          <Button asChild className="shrink-0 bg-orange-500 hover:bg-orange-600 text-navy-950">
            <Link href="/events">
              Book Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/my-subscription">
              <Lock className="h-3.5 w-3.5" />
              Upgrade to PBT {requiredTierLabel} to enrol in exclusive workshops
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
