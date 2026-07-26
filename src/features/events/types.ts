import type { MembershipTier } from "@/features/session/types";

export type EventCategory = "Mentorship" | "In-Person" | "Community" | "Masterclass" | "Onboarding";

export interface RsvpDetails {
  guestCount: number;
  notes: string;
}

export interface EventItem {
  id: string;
  date: string; // ISO date
  title: string;
  timeLabel: string;
  location: string;
  category: EventCategory;
  /** Membership Gate for RSVP -- Pathway means every member can attend. */
  requiredTier: MembershipTier;
  rsvped: boolean;
  rsvpDetails?: RsvpDetails;
}

export type EventsTab = "upcoming" | "past" | "my-rsvps";
