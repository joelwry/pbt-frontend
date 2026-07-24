import type { MembershipTier } from "@/features/session/types";

export interface TierDefinition {
  tier: MembershipTier;
  label: string;
  priceLabel: string;
  contractLabel: string;
  features: string[];
}

export const MEMBERSHIP_TIERS: Record<MembershipTier, TierDefinition> = {
  Pathway: {
    tier: "Pathway",
    label: "Pathway",
    priceLabel: "£39/month",
    contractLabel: "No contract · weekly release",
    features: ["New content released weekly", "Community access", "Monthly newsletter"],
  },
  Plus: {
    tier: "Plus",
    label: "Plus",
    priceLabel: "£79/month",
    contractLabel: "Minimum 6-month contract",
    features: ["Full learning library", "Group coaching calls", "Power Team directory"],
  },
  Mentorship: {
    tier: "Mentorship",
    label: "Mentorship",
    priceLabel: "£149/month",
    contractLabel: "12-month renewable contract",
    features: ["Everything in Plus", "1:1 mentor calls", "Early access releases"],
  },
};

export const TIER_ORDER: MembershipTier[] = ["Pathway", "Plus", "Mentorship"];
