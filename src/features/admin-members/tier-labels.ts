import type { MembershipTier } from "@/features/session/types";

/**
 * `member.tier` stays the internal identifier ("Pathway" | "Plus" |
 * "Mentorship") everywhere in code -- routes, types, API payloads -- per
 * the internal-identifier-vs-display-label pattern (see
 * ARCHITECTURE_HANDBOOK.md §3.3). Only the *rendered text* uses the
 * client-facing name, which is why "Mentorship" is labeled "PBT Masterplan
 * Programme" here rather than the tier value itself being renamed.
 */
export const TIER_LABEL: Record<MembershipTier, string> = {
  Pathway: "PBT Pathway",
  Plus: "PBT Plus",
  Mentorship: "PBT Masterplan Programme",
};

export const TIER_VARIANT: Record<MembershipTier, "outline" | "sky" | "orange"> = {
  Pathway: "outline",
  Plus: "sky",
  Mentorship: "orange",
};
