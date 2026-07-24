export type AdminEventType = "Live Online" | "In-Person" | "Workshop";
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
}

export interface AdminEventsStats {
  upcomingCount: number;
  totalRsvps: number;
  inPersonCount: number;
  inPersonNextLabel: string;
  completedCount: number;
  yearLabel: string;
}

export type EventFilterTab = "Upcoming" | "Past" | "Live Online" | "In-Person" | "Workshop";
