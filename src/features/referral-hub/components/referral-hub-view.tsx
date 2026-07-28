"use client";

import { useState } from "react";
import { Gift, Copy, Check, Users, Wallet, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { useToast } from "@/providers/toast-provider";
import { useReferralSummary, useReferredMembers } from "@/features/referral-hub/hooks/use-referral-hub";
import { ShareButtons } from "@/features/referral-hub/components/share-buttons";

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return { copied, copy };
}

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
        <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <Card className="relative overflow-hidden bg-linear-to-r from-navy-950 to-sky-600 border-none">
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-orange-500 mb-4">
            <Gift className="h-3 w-3" />
            Invite Friends
          </span>
          <h2 className="font-display text-xl font-bold text-white leading-snug max-w-lg">
            Share PBT with someone building their property business — {summary.rewardPerReferralLabel.toLowerCase()}.
          </h2>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <th className="py-2.5 text-right">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {referred.items.map((member) => (
                    <tr key={member.id}>
                      <td className="py-3 pr-4 text-text-primary font-medium">{member.memberName}</td>
                      <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{member.joinedLabel}</td>
                      <td className="py-3 text-right text-text-secondary whitespace-nowrap">£{member.rewardAmount}</td>
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
