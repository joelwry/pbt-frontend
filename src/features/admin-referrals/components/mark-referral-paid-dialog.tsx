"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { useMarkReferralPaid } from "@/features/admin-referrals/hooks/use-admin-referrals";
import type { AdminReferral } from "@/features/admin-referrals/types";

export function MarkReferralPaidDialog({
  referral,
  open,
  onOpenChange,
}: {
  referral: AdminReferral | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useMarkReferralPaid();
  const [paymentReference, setPaymentReference] = useState("");
  const [adminNote, setAdminNote] = useState("");

  if (!referral) return null;

  function handleOpenChange(next: boolean) {
    if (next) {
      setPaymentReference("");
      setAdminNote("");
    }
    onOpenChange(next);
  }

  function handleConfirm() {
    mutate(
      { referralId: referral!.id, input: { paymentReference: paymentReference.trim() || undefined, adminNote: adminNote.trim() || undefined } },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Referral marked as paid",
            description: `£${referral!.rewardAmount} recorded as paid to ${referral!.referrerName}.`,
          });
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast({ variant: "error", title: "Couldn't mark as paid", description: message ?? "Please try again." });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark referral reward as paid</DialogTitle>
          <DialogDescription>
            Records that PBT has paid this reward to {referral.referrerName} outside the portal (e.g. bank transfer).
            This does not move any money itself.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-[#F8FAFC] p-4 space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="text-text-muted">Referred member</span>
            <span className="font-semibold text-text-primary">{referral.referredName}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-text-muted">First payment</span>
            <span className="font-semibold text-text-primary">£{referral.firstPaymentAmount}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-text-muted">Reward ({referral.rewardPercentage}%)</span>
            <span className="font-semibold text-text-primary">£{referral.rewardAmount}</span>
          </p>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="payment-reference">Payment reference (optional)</Label>
          <Input
            id="payment-reference"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="e.g. bank transfer ref, batch id"
            autoFocus
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="admin-note">Note (optional)</Label>
          <textarea
            id="admin-note"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder="Anything worth recording about this payout"
            className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Mark as Paid
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
