import type { MembershipTier } from "@/features/session/types";

/**
 * Pricing deliberately isn't here -- it's admin-controlled and fetched live
 * via features/pricing (usePricing()), since an admin can change it (e.g. a
 * promotional offer) without a redeploy. Anything shown here is static
 * marketing copy that doesn't change when pricing does.
 */
export interface TierDefinition {
  tier: MembershipTier;
  label: string;
  contractLabel: string;
  features: string[];
}

export const MEMBERSHIP_TIERS: Record<MembershipTier, TierDefinition> = {
  Pathway: {
    tier: "Pathway",
    label: "Pathway",
    contractLabel: "No contract · weekly release",
    features: ["New content released weekly", "Community access", "Monthly newsletter"],
  },
  Plus: {
    tier: "Plus",
    label: "Plus",
    contractLabel: "Minimum 6-month contract",
    features: ["Full learning library", "Group coaching calls", "Power Team directory"],
  },
  Mentorship: {
    tier: "Mentorship",
    label: "Masterplan Programme",
    contractLabel: "12-month renewable contract",
    features: ["Everything in Plus", "1:1 mentor calls", "Early access releases", "Power Team directory"],
  },
};

export const TIER_ORDER: MembershipTier[] = ["Pathway", "Plus", "Mentorship"];
