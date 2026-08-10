// Unified with the backend's real Event.category enum (Event.schema.ts) —
// this used to be a mismatched, mock-only 3-value "type" (Live Online/
// In-Person/Workshop) with no backend counterpart at all.
export type AdminEventType = "Mentorship" | "In-Person" | "Community" | "Masterclass" | "Onboarding";
export type AdminEventStatus = "Upcoming" | "Completed" | "Cancelled";
export type EventRsvpVisibility = "all" | "plus-mentorship" | "mentorship";

export interface AdminEvent {
  id: string;
  title: string;
  date: string; // ISO date
  startTime: string; // "10:00"
  endTime: string; // "13:00"
  type: AdminEventType;
  rsvpCount: number;
  capacity: number;
  status: AdminEventStatus;
  location: string;
  description: string;
  visibility: EventRsvpVisibility;
  /** Past-event media -- set by an admin after the event has taken place. */
  photoGalleryUrl?: string;
  recordingUrl?: string;
  slidesUrl?: string;
}

export interface AdminEventsStats {
  upcomingCount: number;
  totalRsvps: number;
  inPersonCount: number;
  inPersonNextLabel: string;
  completedCount: number;
  yearLabel: string;
}

export type EventFilterTab = "Upcoming" | "Past" | AdminEventType;
