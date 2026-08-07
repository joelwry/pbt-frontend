import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP_TIERS } from "@/features/membership/tiers";
import type { MembershipTier } from "@/features/session/types";

export function SubscriptionGate({
  requiredTier,
  currentTier,
}: {
  requiredTier: MembershipTier;
  currentTier: MembershipTier;
}) {
  const required = MEMBERSHIP_TIERS[requiredTier];
  const current = MEMBERSHIP_TIERS[currentTier];

  return (
    <Card className="relative overflow-hidden text-center py-16 px-6">
      <div
        className="absolute inset-0 bg-linear-to-br from-navy-950 to-navy-900 opacity-[0.03]"
        aria-hidden
      />
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-navy-900 text-orange-500 flex items-center justify-center mx-auto">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary mt-5">
          You&apos;re not subscribed to PBT {required.label}
        </h2>
        <p className="text-sm text-text-muted mt-2 max-w-md mx-auto leading-relaxed">
          Your current plan is <span className="font-semibold text-text-primary">PBT {current.label}</span>.
          Upgrade to PBT {required.label} to unlock this page.
        </p>

        <div className="flex items-center justify-center gap-3 mt-7 flex-wrap">
          <Button asChild>
            <Link href="/my-subscription">
              <Sparkles className="h-4 w-4" />
              Upgrade to PBT {required.label}
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
