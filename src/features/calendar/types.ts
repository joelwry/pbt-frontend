export type CalendarEventType = "Mentorship" | "In-Person" | "Community" | "Masterclass" | "Onboarding";

export interface CalendarEvent {
  id: string;
  date: string; // ISO date, e.g. "2026-07-14"
  title: string;
  timeLabel: string;
  type: CalendarEventType;
  location: string;
  requiredTier: "Pathway" | "Plus" | "Mentorship";
}
