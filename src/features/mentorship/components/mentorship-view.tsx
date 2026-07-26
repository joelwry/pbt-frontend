"use client";

import { Crown, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMentorshipPage } from "@/features/mentorship/hooks/use-mentorship";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { tierMeetsRequirement } from "@/features/session/tier-rank";
import { SubscriptionGate } from "@/features/membership/components/subscription-gate";
import { BookCallDialog } from "@/features/mentorship/components/book-call-dialog";
import { MentorshipCallsTable } from "@/features/mentorship/components/mentorship-calls-table";

export function MentorshipView() {
  const { data, isLoading, isError, refetch } = useMentorshipPage();
  const { data: member, isLoading: memberLoading } = useCurrentMember();

  if (isLoading || memberLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Mentorship" description="Your premium 1:1 mentorship membership." />
        <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Skeleton className="h-64 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (isError || !data || !member) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Mentorship" description="Your premium 1:1 mentorship membership." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const hasAccess = tierMeetsRequirement(member.membershipTier, "Mentorship");

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Mentorship" description="Your premium 1:1 mentorship membership." />
        <SubscriptionGate requiredTier="Mentorship" currentTier={member.membershipTier} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="PBT Mentorship" description="Your premium 1:1 mentorship membership." />

      <Card className="bg-linear-to-r from-navy-950 to-sky-600 border-none">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-orange-500 mb-4">
              <Crown className="h-3 w-3" />
              {data.tagline}
            </span>
            <h2 className="font-display text-2xl font-bold text-white leading-snug">{data.headline}</h2>
            <p className="text-sm text-white/70 mt-3 leading-relaxed">{data.description}</p>
            <div className="mt-4">
              <BookCallDialog mentorName={data.assignedMentor.name} triggerLabel="Book Your Next Call" />
            </div>
          </div>
          <div className="rounded-xl bg-white/10 px-5 py-4 text-center shrink-0">
            <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">Renews</p>
            <p className="font-display text-base font-bold text-white mt-1">{data.renewsLabel}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Mentorship Benefits</h3>
          <p className="text-sm text-text-muted mb-5">Everything in PBT Plus, plus:</p>
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

        <Card className="text-center">
          <h3 className="font-display text-base font-semibold text-text-primary mb-4 text-left">Your Assigned Mentor</h3>
          <div className="h-16 w-16 rounded-full bg-orange-500 text-white text-lg font-bold flex items-center justify-center mx-auto">
            {data.assignedMentor.initials}
          </div>
          <p className="font-semibold text-text-primary mt-3">{data.assignedMentor.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{data.assignedMentor.regionLabel}</p>
          <Badge variant="orange" className="mt-3">
            {data.assignedMentor.badgeLabel}
          </Badge>
          <div className="mt-4">
            <BookCallDialog mentorName={data.assignedMentor.name} triggerLabel="Schedule Call" />
          </div>
        </Card>
      </div>

      <MentorshipCallsTable mentorName={data.assignedMentor.name} />
    </div>
  );
}
