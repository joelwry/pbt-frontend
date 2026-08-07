"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { joinSchema, type JoinFormValues } from "@/features/join/join-schema";
import { joinRepository, getJoinErrorMessage } from "@/features/join/repositories/join.repository";
import { usePricing } from "@/features/pricing/hooks/use-pricing";
import { formatAmount } from "@/features/pricing/services/pricing.service";
import { MEMBERSHIP_TIERS, TIER_ORDER } from "@/features/membership/tiers";

export function JoinForm() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref") ?? undefined;
  const preselectedTier = searchParams.get("tier");
  const { data: pricing, isLoading: pricingLoading } = usePricing();

  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      fullName: "",
      email: "",
      tier: TIER_ORDER.includes(preselectedTier as never) ? (preselectedTier as JoinFormValues["tier"]) : "Plus",
      billingCycle: "monthly",
    },
  });

  const selectedTier = watch("tier");
  const billingCycle = watch("billingCycle");

  async function onSubmit(values: JoinFormValues) {
    setFormError(null);
    setIsPending(true);
    try {
      const { data } = await joinRepository.createSignupCheckout(values, referralCode);
      window.location.href = data.checkoutUrl;
    } catch (error) {
      setFormError(getJoinErrorMessage(error));
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {formError && (
        <div role="alert" className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {formError}
        </div>
      )}

      <div>
        <Label>Choose your membership</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {TIER_ORDER.map((tier) => {
            const def = MEMBERSHIP_TIERS[tier];
            const isSelected = selectedTier === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setValue("tier", tier)}
                className={cn(
                  "text-left rounded-xl border-2 px-4 py-3.5 transition-colors",
                  isSelected ? "border-orange-500 bg-orange-tint" : "border-border hover:border-sky-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">{def.label}</p>
                  {isSelected && <Check className="h-4 w-4 text-orange-600" />}
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {pricingLoading ? "…" : `${formatAmount(pricing?.[tier].monthly ?? 0)} + VAT/month`}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-[#F5F8FA] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Bill annually</p>
          {pricingLoading ? (
            <Skeleton className="h-4 w-32 mt-1" />
          ) : (
            <p className="text-xs text-text-muted mt-0.5">
              {billingCycle === "annual"
                ? `${formatAmount(pricing?.[selectedTier].annual ?? 0)} + VAT/year (2 months free)`
                : `${formatAmount(pricing?.[selectedTier].monthly ?? 0)} + VAT/month`}
            </p>
          )}
        </div>
        <Controller
          control={control}
          name="billingCycle"
          render={({ field }) => (
            <Switch
              checked={field.value === "annual"}
              onCheckedChange={(checked) => field.onChange(checked ? "annual" : "monthly")}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" placeholder="Jane Doe" autoComplete="name" invalid={!!errors.fullName} {...register("fullName")} />
        {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="you@email.com" autoComplete="email" invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to Stripe…
          </>
        ) : (
          <>
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
