"use client";

import { useState } from "react";
import { Gift, Copy, Check, Users, Wallet, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { useToast } from "@/providers/toast-provider";
import { useReferralSummary, useReferredMembers } from "@/features/referral-hub/hooks/use-referral-hub";
import { ShareButtons } from "@/features/referral-hub/components/share-buttons";
import type { ReferralStatus } from "@/features/referral-hub/types";

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copied, copy };
}

const STATUS_VARIANT: Record<ReferralStatus, "slate" | "warning" | "sky" | "success"> = {
  REFERRED: "slate",
  CUSTOMER_SIGNED_UP: "slate",
  AWAITING_FIRST_PAYMENT: "warning",
  FIRST_PAYMENT_RECEIVED: "sky",
  REWARD_EARNED: "sky",
  PAYMENT_PENDING: "warning",
  PAID: "success",
};

export function ReferralHubView() {
  const { data: summary, isLoading, isError, refetch } = useReferralSummary();
  const { copied, copy } = useCopyToClipboard();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const { data: referred, isLoading: referredLoading } = useReferredMembers(page);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Referral Hub" description="Invite friends to PBT and earn rewards for every successful referral." />
        <Skeleton className="h-56 w-full rounded-[var(--radius-card)]" />
        <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-[var(--radius-card)]" />
          <Skeleton className="h-28 rounded-[var(--radius-card)]" />
          <Skeleton className="h-28 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="space-y-6">
        <PageHeader title="Referral Hub" description="Invite friends to PBT and earn rewards for every successful referral." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  function handleCopy() {
    copy(summary!.referralLink);
    toast({ variant: "success", title: "Link copied", description: "Your referral link is ready to share." });
  }

  function handleEmailShare() {
    const subject = encodeURIComponent("Join me on Property Business Training");
    const body = encodeURIComponent(
      `I thought you'd love PBT — here's my referral link to get started: ${summary!.referralLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  }

  function handleWhatsAppShare() {
    const text = encodeURIComponent(
      `I thought you'd love PBT — here's my referral link to get started: ${summary!.referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function handleFacebookShare() {
    const url = encodeURIComponent(summary!.referralLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Referral Hub" description="Invite friends to PBT and earn rewards for every successful referral." />

      <Card className="p-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- static local asset, no next/image usage precedent elsewhere in this codebase */}
        <img src="/referrals/referral-hero.png" alt="Earn extra cash with the PBT referral programme" className="w-full h-auto block" />
      </Card>

      <Card className="relative overflow-hidden bg-linear-to-r from-navy-950 to-sky-600 border-none">
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-orange-500 mb-4">
            <Gift className="h-3 w-3" />
            Invite Friends
          </span>
          <h2 className="font-display text-xl font-bold text-white leading-snug max-w-lg">
            Share PBT with someone building their property business — {summary.rewardDescriptionLabel.toLowerCase()}.
          </h2>
          <p className="text-sm text-white/70 mt-2 max-w-lg">
            e.g. they join PBT Pathway (£99) → you earn £9.90. They join PBT Plus (£249) → you earn £24.90. It&apos;s a
            one-time reward on their first payment only — not on every month they stay subscribed.
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 max-w-xl">
            <span className="text-sm text-white/90 font-mono truncate flex-1">{summary.referralLink}</span>
            <Button size="sm" variant="secondary" onClick={handleCopy} className="shrink-0">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <ShareButtons onEmail={handleEmailShare} onWhatsApp={handleWhatsAppShare} onFacebook={handleFacebookShare} />
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-sky-tint text-sky-600 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-text-primary">{summary.totalReferrals}</p>
            <p className="text-sm text-text-muted">Total Referrals</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-orange-tint text-orange-500 flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-text-primary">£{summary.rewardsEarned}</p>
            <p className="text-sm text-text-muted">Rewards Earned</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-text-primary">£{summary.rewardsPaid}</p>
            <p className="text-sm text-text-muted">Rewards Paid</p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Your Referrals</h3>
        {referredLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !referred || referred.items.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No referrals yet"
            description="Share your link above — successful referrals will appear here."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                    <th className="py-2.5 pr-4">Member</th>
                    <th className="py-2.5 pr-4">Joined</th>
                    <th className="py-2.5 pr-4">Plan</th>
                    <th className="py-2.5 pr-4">First Payment</th>
                    <th className="py-2.5 pr-4 text-right">Reward</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {referred.items.map((member) => (
                    <tr key={member.id}>
                      <td className="py-3 pr-4 text-text-primary font-medium">{member.memberName}</td>
                      <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{member.joinedLabel}</td>
                      <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{member.tierLabel ?? "—"}</td>
                      <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">
                        {member.firstPaymentAmount !== null ? `£${member.firstPaymentAmount}` : "—"}
                      </td>
                      <td className="py-3 pr-4 text-right text-text-secondary whitespace-nowrap">
                        {member.rewardAmount !== null ? `£${member.rewardAmount}` : "—"}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <Badge variant={STATUS_VARIANT[member.status]}>{member.statusLabel}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={referred.pagination.totalPages} onPageChange={setPage} className="mt-4" />
          </>
        )}
      </Card>
    </div>
  );
}
