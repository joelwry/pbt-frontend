export type MembershipTier = "Pathway" | "Plus" | "Mentorship";
export type SubscriptionStatus = "active" | "expired";

export interface CurrentMember {
  id: string;
  clientId: string;
  fullName: string;
  initials: string;
  email: string;
  avatarUrl?: string;
  membershipTier: MembershipTier;
  subscriptionStatus: SubscriptionStatus;
  /** ISO date. Renewal/next-billing date when active, or the date access lapsed when expired. */
  subscriptionDate: string;
}
