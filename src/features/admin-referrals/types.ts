export type ReferralStatus =
  | "REFERRED"
  | "CUSTOMER_SIGNED_UP"
  | "AWAITING_FIRST_PAYMENT"
  | "FIRST_PAYMENT_RECEIVED"
  | "REWARD_EARNED"
  | "PAYMENT_PENDING"
  | "PAID";

export type ReferralFilterKey = "PENDING" | "AWAITING_FIRST_PAYMENT" | "REWARD_EARNED" | "PAYMENT_PENDING" | "PAID";

export const REFERRAL_FILTER_OPTIONS: { key: ReferralFilterKey; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "AWAITING_FIRST_PAYMENT", label: "Awaiting first payment" },
  { key: "REWARD_EARNED", label: "Reward earned" },
  { key: "PAYMENT_PENDING", label: "Payment pending" },
  { key: "PAID", label: "Paid" },
];

export interface AdminReferralStats {
  totalReferrals: number;
  totalRewardsEarned: number;
  totalRewardsPaid: number;
  totalRewardsOutstanding: number;
}

export interface AdminReferral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  tierLabel: string | null;
  firstPaymentAmount: number | null;
  firstPaymentDateLabel: string | null;
  rewardPercentage: number;
  rewardAmount: number | null;
  status: ReferralStatus;
  statusLabel: string;
  paymentReference: string | null;
  adminNote: string | null;
  paidByName: string | null;
  paidDateLabel: string | null;
  createdDateLabel: string;
}
