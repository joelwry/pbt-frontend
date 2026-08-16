"use client";

import { useState } from "react";
import { Download, LogOut, Loader2 } from "lucide-react";
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
import { useCancelSubscription } from "@/features/subscription/hooks/use-subscription";
import type { SubscriptionSummary } from "@/features/subscription/types";

export function SubscriptionActionsCard({
  subscription,
  onCancelled,
}: {
  subscription: SubscriptionSummary;
  onCancelled: () => void;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { mutate: cancel, isPending } = useCancelSubscription(() => {
    setCancelOpen(false);
    onCancelled();
  });

  return (
    <Card>
      <div className="space-y-2.5">
        <Button
          variant="secondary"
          className="w-full justify-start"
          onClick={() => document.getElementById("billing-history")?.scrollIntoView({ behavior: "smooth" })}
        >
          <Download className="h-4 w-4" />
          Download Invoices
        </Button>

        {!subscription.cancelled && (
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-[#FEF2F2]">
                <LogOut className="h-4 w-4" />
                Cancel Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel your membership?</DialogTitle>
                <DialogDescription>
                  You&apos;ll keep access until {subscription.nextBillingLabel}. After that, your Learning, Community and
                  Events access will be limited to the free tier. This can&apos;t be undone from the portal.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3 mt-2">
                <DialogClose asChild>
                  <Button variant="secondary" className="flex-1">
                    Keep Membership
                  </Button>
                </DialogClose>
                <Button variant="danger" className="flex-1" disabled={isPending} onClick={() => cancel()}>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? "Cancelling…" : "Yes, Cancel"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
}
