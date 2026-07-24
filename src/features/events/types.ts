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
  rsvped: boolean;
  rsvpDetails?: RsvpDetails;
}

export type EventsTab = "upcoming" | "past" | "my-rsvps";
