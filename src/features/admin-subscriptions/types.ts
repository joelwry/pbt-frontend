import type { MembershipTier } from "@/features/session/types";

export type { MembershipTier };
export type InvoiceStatus = "Paid" | "Failed" | "Refunded";

export interface SubscriptionStats {
  mrr: number;
  mrrDeltaLabel: string;
  payingMembers: number;
  failedPaymentsCount: number;
  churnRatePercent: number;
}

export interface RevenueTierSegment {
  tier: MembershipTier;
  label: string;
  priceLabel: string;
  percent: number;
}

export interface RevenueByTier {
  mrrLabel: string;
  segments: RevenueTierSegment[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  memberName: string;
  memberInitials: string;
  tier: MembershipTier;
  amount: number;
  dateLabel: string;
  status: InvoiceStatus;
}
