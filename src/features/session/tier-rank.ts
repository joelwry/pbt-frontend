import type { MembershipTier } from "@/features/session/types";

export const TIER_RANK: Record<MembershipTier, number> = {
  Pathway: 0,
  Plus: 1,
  Mentorship: 2,
};

export function tierMeetsRequirement(memberTier: MembershipTier, requiredTier: MembershipTier): boolean {
  return TIER_RANK[memberTier] >= TIER_RANK[requiredTier];
}
