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
  /** True when capacity is reached and this member hasn't already got a spot -- shown upfront so a member doesn't discover it's full only after opening the RSVP form. */
  isFull: boolean;
  rsvpDetails?: RsvpDetails;
  /** Past-event media -- set by an admin after the event has taken place; absent until then. */
  photoGalleryUrl?: string;
  recordingUrl?: string;
  slidesUrl?: string;
}

export type EventsTab = "upcoming" | "past" | "my-rsvps";
