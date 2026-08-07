"use client";

import Link from "next/link";
import { Sparkles, Check, GraduationCap, CalendarDays, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlusPage } from "@/features/plus/hooks/use-plus";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { tierMeetsRequirement } from "@/features/session/tier-rank";
import { TierComparisonCard } from "@/features/membership/components/tier-comparison-card";
import { SubscriptionGate } from "@/features/membership/components/subscription-gate";
import { useSiteSettings } from "@/features/site-settings/hooks/use-site-settings";

export function PlusView() {
  const { data, isLoading, isError, refetch } = usePlusPage();
  const { data: member, isLoading: memberLoading } = useCurrentMember();
  const { workshopLabel } = useSiteSettings();

  if (isLoading || memberLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Plus" description="Membership tier details and included benefits." />
        <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Skeleton className="h-80 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (isError || !data || !member) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Plus" description="Membership tier details and included benefits." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const hasAccess = tierMeetsRequirement(member.membershipTier, "Plus");

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Plus" description="Membership tier details and included benefits." />
        <SubscriptionGate requiredTier="Plus" currentTier={member.membershipTier} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="PBT Plus" description="Membership tier details and included benefits." />

      <Card className="bg-linear-to-r from-navy-950 to-sky-600 border-none">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-orange-500 mb-4">
              <Sparkles className="h-3 w-3" />
              {data.tagline}
            </span>
            <h2 className="font-display text-2xl font-bold text-white leading-snug">{data.headline}</h2>
            <p className="text-sm text-white/70 mt-3 leading-relaxed">{data.description}</p>
            {member.membershipTier !== "Plus" && (
              <span className="inline-block mt-4 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80">
                Included in your PBT {member.membershipTier} membership
              </span>
            )}
          </div>
          <div className="rounded-xl bg-white/10 px-5 py-4 text-center shrink-0">
            <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">Status</p>
            <p className="font-display text-base font-bold text-white mt-1">Active Access</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/pbt-plus/learning" className="block group">
          <Card className="h-full flex items-center justify-between gap-4 flex-wrap bg-linear-to-r from-navy-950 to-navy-900 border-none group-hover:opacity-95 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 text-orange-500 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-white">PBT Plus Learning</p>
                <p className="text-sm text-white/70 mt-0.5">Lessons reserved exclusively for PBT Plus members.</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-white/70 shrink-0" />
          </Card>
        </Link>

        <Link href="/workshops" className="block group">
          <Card className="h-full flex items-center justify-between gap-4 flex-wrap bg-linear-to-r from-sky-600 to-navy-900 border-none group-hover:opacity-95 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 text-orange-500 flex items-center justify-center shrink-0">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-white">{workshopLabel}s</p>
                <p className="text-sm text-white/70 mt-0.5">Enrol in exclusive live {workshopLabel.toLowerCase()}s.</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-white/70 shrink-0" />
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-1">What&apos;s included</h3>
          <p className="text-sm text-text-muted mb-5">
            All PBT Plus benefits, included at no extra cost as part of your current plan.
          </p>
          <ul className="divide-y divide-border">
            {data.benefits.map((benefit) => (
              <li key={benefit.id} className="flex items-start gap-3 py-3.5">
                <div className="h-6 w-6 rounded-md bg-navy-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{benefit.title}</p>
                  <p className="text-sm text-text-muted mt-0.5">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="text-center">
            <div className="h-14 w-14 rounded-2xl bg-navy-900 text-orange-500 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="font-display text-base font-semibold text-text-primary mt-3">PBT Plus</p>
            <p className="text-xs text-text-muted mt-0.5">Professional membership tier</p>
            <Badge variant="sky" className="mt-4">
              You have full access
            </Badge>
          </Card>
          <TierComparisonCard currentTier={member.membershipTier} />
        </div>
      </div>
    </div>
  );
}
