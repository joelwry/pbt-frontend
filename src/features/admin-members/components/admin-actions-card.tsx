"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Lock, LockOpen, Send, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/providers/toast-provider";
import {
  useChangeTier,
  useSetPaused,
  useResendWelcomeEmail,
  useDeactivateAccount,
} from "@/features/admin-members/hooks/use-admin-members";
import { TIER_LABEL } from "@/features/admin-members/tier-labels";
import type { AdminMemberDetail } from "@/features/admin-members/types";
import type { MembershipTier } from "@/features/session/types";

const TIER_OPTIONS: MembershipTier[] = ["Pathway", "Plus", "Mentorship"];

export function AdminActionsCard({ member }: { member: AdminMemberDetail }) {
  const { toast } = useToast();
  const router = useRouter();

  const [changeTierOpen, setChangeTierOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(member.tier);
  const { mutate: changeTier, isPending: isChangingTier } = useChangeTier();

  const { mutate: setPaused, isPending: isTogglingPause } = useSetPaused();

  const { mutate: resendEmail, isPending: isResending } = useResendWelcomeEmail();

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateAccount();

  const isPaused = member.status === "Paused";

  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Admin Actions</h3>
      <div className="space-y-2.5">
        <Dialog open={changeTierOpen} onOpenChange={setChangeTierOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full justify-start">
              <CreditCard className="h-4 w-4" />
              Change Tier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change membership tier</DialogTitle>
              <DialogDescription>
                Update {member.fullName}&apos;s tier. This takes effect immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {TIER_OPTIONS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    selectedTier === tier
                      ? "border-sky-500 bg-sky-tint text-text-primary"
                      : "border-border bg-white text-text-secondary hover:bg-[#F5F8FA]"
                  }`}
                >
                  {TIER_LABEL[tier]}
                </button>
              ))}
            </div>
            <Button
              className="w-full mt-4"
              disabled={isChangingTier || selectedTier === member.tier}
              onClick={() =>
                changeTier(
                  { id: member.id, tier: selectedTier },
                  {
                    onSuccess: () => {
                      setChangeTierOpen(false);
                      toast({ variant: "success", title: "Tier updated", description: `${member.fullName} is now on ${TIER_LABEL[selectedTier]}.` });
                    },
                  }
                )
              }
            >
              {isChangingTier && <Loader2 className="h-4 w-4 animate-spin" />}
              {isChangingTier ? "Updating…" : "Confirm Change"}
            </Button>
          </DialogContent>
        </Dialog>

        <Button
          variant="secondary"
          className="w-full justify-start"
          disabled={isTogglingPause}
          onClick={() =>
            setPaused(
              { id: member.id, paused: !isPaused },
              {
                onSuccess: () => {
                  toast({
                    variant: "info",
                    title: isPaused ? "Membership resumed" : "Membership paused",
                    description: `${member.fullName}'s access has been ${isPaused ? "restored" : "paused"}.`,
                  });
                },
              }
            )
          }
        >
          {isTogglingPause ? <Loader2 className="h-4 w-4 animate-spin" /> : isPaused ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {isPaused ? "Resume Membership" : "Pause Membership"}
        </Button>

        <Button
          variant="secondary"
          className="w-full justify-start"
          disabled={isResending}
          onClick={() =>
            resendEmail(member.id, {
              onSuccess: () => toast({ variant: "success", title: "Welcome email sent", description: `Sent to ${member.email}.` }),
            })
          }
        >
          {isResending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Resend Welcome Email
        </Button>

        <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-[#FEF2F2]">
              <Trash2 className="h-4 w-4" />
              Deactivate Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate {member.fullName}&apos;s account?</DialogTitle>
              <DialogDescription>
                They&apos;ll immediately lose access to the member portal. Their record and history are kept — this
                doesn&apos;t delete data, use Delete from Member Management for that.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-3 mt-2">
              <DialogClose asChild>
                <Button variant="secondary" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="danger"
                className="flex-1"
                disabled={isDeactivating}
                onClick={() =>
                  deactivate(member.id, {
                    onSuccess: () => {
                      setDeactivateOpen(false);
                      toast({ variant: "success", title: "Account deactivated", description: `${member.fullName}'s account has been deactivated.` });
                      router.push("/admin/members");
                    },
                  })
                }
              >
                {isDeactivating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeactivating ? "Deactivating…" : "Deactivate Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
