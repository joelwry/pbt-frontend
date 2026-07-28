export interface AdminReferralStats {
  totalReferrals: number;
  totalRewardsIssued: number;
}

export interface AdminReferral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  rewardAmount: number;
  dateLabel: string;
}
