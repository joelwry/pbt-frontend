import Link from "next/link";
import { Handshake, Scale, Landmark, Calculator, Ruler, KeyRound, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP_TIERS } from "@/features/membership/tiers";
import type { MembershipTier } from "@/features/session/types";

const CATEGORIES = [
  { label: "Solicitors", icon: Scale },
  { label: "Mortgage Brokers", icon: Landmark },
  { label: "Accountants", icon: Calculator },
  { label: "Surveyors", icon: Ruler },
  { label: "Letting Agents", icon: KeyRound },
];

export function PowerTeamGate({ currentTier }: { currentTier: MembershipTier }) {
  const current = MEMBERSHIP_TIERS[currentTier];

  return (
    <Card className="relative overflow-hidden text-center py-16 px-6">
      <div
        className="absolute inset-0 bg-linear-to-br from-navy-950 to-navy-900 opacity-[0.03]"
        aria-hidden
      />
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-navy-900 text-orange-500 flex items-center justify-center mx-auto">
          <Handshake className="h-7 w-7" />
        </div>
        <h2 className="font-display text-xl font-bold text-text-primary mt-5">What is the Power Team?</h2>
        <p className="text-sm text-text-muted mt-2 max-w-lg mx-auto leading-relaxed">
          The Power Team is our directory of vetted, PBT-trusted professionals — solicitors, mortgage brokers,
          accountants, surveyors and letting agents who understand property investors and are ready to work with
          you. It&apos;s a benefit exclusively for members on <span className="font-semibold text-text-primary">PBT Plus</span> or{" "}
          <span className="font-semibold text-text-primary">PBT Masterplan Programme</span>.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 max-w-2xl mx-auto">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-white px-3 py-4 flex flex-col items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-sky-tint text-sky-600 flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-text-secondary text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-text-muted mt-7 max-w-md mx-auto leading-relaxed">
          Your current plan is <span className="font-semibold text-text-primary">PBT {current.label}</span>. Upgrade
          to unlock direct introductions to every professional in the directory.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <Button asChild>
            <Link href="/my-subscription">
              <Sparkles className="h-4 w-4" />
              Upgrade Your Membership
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
