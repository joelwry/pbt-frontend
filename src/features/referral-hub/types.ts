export interface ReferralSummary {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  /** Total reward value across every referral that has qualified (earned, processing, or paid). */
  rewardsEarned: number;
  /** Total reward value that has actually been paid out. */
  rewardsPaid: number;
  rewardPercentage: number;
  rewardDescriptionLabel: string;
}

export type ReferralStatus =
  | "REFERRED"
  | "CUSTOMER_SIGNED_UP"
  | "AWAITING_FIRST_PAYMENT"
  | "FIRST_PAYMENT_RECEIVED"
  | "REWARD_EARNED"
  | "PAYMENT_PENDING"
  | "PAID";

export interface ReferredMember {
  id: string;
  memberName: string;
  joinedLabel: string;
  tierLabel: string | null;
  firstPaymentAmount: number | null;
  rewardAmount: number | null;
  status: ReferralStatus;
  statusLabel: string;
  paidDateLabel: string | null;
}
