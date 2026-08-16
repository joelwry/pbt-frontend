import type { MembershipTier } from "@/features/session/types";

export interface SubscriptionSummary {
  tier: MembershipTier;
  /** Whether the member has requested cancellation (still has access until nextBillingLabel either way — actual portal access is gated by the member's subscriptionStatus, not this flag). */
  cancelled: boolean;
  contractLabel: string;
  clientId: string;
  nextBillingLabel: string;
  amountLabel: string;
}

export type InvoiceStatus = "Paid" | "Pending" | "Failed";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  dateLabel: string;
  amountLabel: string;
  status: InvoiceStatus;
}
