"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { useSetPricing } from "@/features/admin-pricing/hooks/use-admin-pricing";
import type { AdminTierPricing } from "@/features/admin-pricing/types";

export function EditPricingDialog({
  row,
  open,
  onOpenChange,
}: {
  row: AdminTierPricing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { mutate, isPending } = useSetPricing();
  const [amount, setAmount] = useState("");

  if (!row) return null;

  function handleOpenChange(next: boolean) {
    if (next) setAmount(String(row!.amount));
    onOpenChange(next);
  }

  function handleSave() {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast({ variant: "error", title: "Enter a valid amount", description: "Amount must be a positive number." });
      return;
    }
    mutate(
      { tier: row!.tier, billingCycle: row!.billingCycle, amount: parsed },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Pricing updated",
            description: `${row!.tierLabel} (${row!.billingCycle}) is now £${parsed} + VAT. This creates a new Stripe price -- existing subscribers keep their current price until they renew.`,
          });
          onOpenChange(false);
        },
        onError: () => {
          toast({ variant: "error", title: "Couldn't update pricing", description: "Please try again." });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {row.tierLabel} — {row.billingCycle === "monthly" ? "Monthly" : "Annual"}
          </DialogTitle>
          <DialogDescription>
            Sets a new price effective immediately for new checkouts (e.g. a promotional offer). Stripe prices are
            immutable, so this creates a new price and archives the old one -- existing subscribers are unaffected
            until they renew or change tier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="pricing-amount">Amount (£, excl. VAT)</Label>
          <Input
            id="pricing-amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Price
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
