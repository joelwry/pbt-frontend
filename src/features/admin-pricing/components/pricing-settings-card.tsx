"use client";

import { useState } from "react";
import { Pencil, RotateCcw, Tag, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useAdminPricing, useResetPricing } from "@/features/admin-pricing/hooks/use-admin-pricing";
import { EditPricingDialog } from "@/features/admin-pricing/components/edit-pricing-dialog";
import type { AdminTierPricing, AdminBillingTier, AdminBillingCycle } from "@/features/admin-pricing/types";

const TIER_ORDER: AdminBillingTier[] = ["pathway", "plus", "mentorship"];

export function PricingSettingsCard() {
  const { data: rows, isLoading } = useAdminPricing();
  const { mutate: reset, isPending: isResetting, variables: resetVariables } = useResetPricing();
  const { toast } = useToast();
  const [editingRow, setEditingRow] = useState<AdminTierPricing | null>(null);

  function handleReset(tier: AdminBillingTier, billingCycle: AdminBillingCycle, tierLabel: string) {
    reset(
      { tier, billingCycle },
      {
        onSuccess: () => {
          toast({ variant: "success", title: "Reset to default", description: `${tierLabel} (${billingCycle}) is back to its default price.` });
        },
        onError: () => {
          toast({ variant: "error", title: "Couldn't reset pricing", description: "Please try again." });
        },
      }
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <Tag className="h-4 w-4 text-sky-600" />
        <h3 className="font-display text-lg font-semibold text-text-primary">Membership Pricing</h3>
      </div>
      <p className="text-sm text-text-muted mb-5">
        Fixed defaults per tier, with the ability to run a promotional price without a redeploy. Changes apply to
        new checkouts immediately; existing subscribers keep their price until they renew or change tier.
      </p>

      {isLoading || !rows ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                <th className="py-2.5 pr-4">Tier</th>
                <th className="py-2.5 pr-4">Monthly</th>
                <th className="py-2.5 pr-4">Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TIER_ORDER.map((tier) => {
                const monthly = rows.find((r) => r.tier === tier && r.billingCycle === "monthly");
                const annual = rows.find((r) => r.tier === tier && r.billingCycle === "annual");
                return (
                  <tr key={tier}>
                    <td className="py-3.5 pr-4 font-medium text-text-primary whitespace-nowrap">{monthly?.tierLabel ?? annual?.tierLabel}</td>
                    {([monthly, annual] as const).map((row, cycleIndex) =>
                      row ? (
                        <td key={row.billingCycle} className="py-3.5 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text-primary">£{row.amount}</span>
                            <span className="text-xs text-text-muted">+ VAT</span>
                            <Badge variant={row.isDefault ? "outline" : "orange"} className="ml-1">
                              {row.isDefault ? "Default" : "Custom"}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => setEditingRow(row)}
                              className="text-text-muted hover:text-sky-600 transition-colors"
                              aria-label={`Edit ${row.tierLabel} ${row.billingCycle} price`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            {!row.isDefault && (
                              <button
                                type="button"
                                onClick={() => handleReset(row.tier, row.billingCycle, row.tierLabel)}
                                disabled={isResetting && resetVariables?.tier === row.tier && resetVariables?.billingCycle === row.billingCycle}
                                className="text-text-muted hover:text-orange-600 transition-colors"
                                aria-label={`Reset ${row.tierLabel} ${row.billingCycle} price to default`}
                              >
                                {isResetting && resetVariables?.tier === row.tier && resetVariables?.billingCycle === row.billingCycle ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      ) : (
                        <td key={cycleIndex} />
                      )
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <EditPricingDialog row={editingRow} open={Boolean(editingRow)} onOpenChange={(open) => !open && setEditingRow(null)} />
    </Card>
  );
}
