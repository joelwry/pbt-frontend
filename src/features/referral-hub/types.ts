export interface ReferralSummary {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  rewardsEarned: number;
  rewardPerReferralLabel: string;
}

export interface ReferredMember {
  id: string;
  memberName: string;
  joinedLabel: string;
  rewardAmount: number;
}
