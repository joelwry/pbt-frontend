import type { ApiSuccess } from "@/types/api";
import type { CalendarEvent } from "@/features/calendar/types";

export const calendarEventsMock: ApiSuccess<CalendarEvent[]> = {
  success: true,
  message: "Calendar events retrieved successfully",
  data: [
    { id: "cal_1", date: "2026-07-02", title: "Deal Structuring", timeLabel: "7:00 PM · Online", type: "Masterclass", location: "Online" },
    { id: "cal_2", date: "2026-07-08", title: "Regional Meetup — Midlands Investors", timeLabel: "11:00 AM · Birmingham", type: "In-Person", location: "Birmingham" },
    { id: "cal_3", date: "2026-07-14", title: "Mentorship Q&A", timeLabel: "6:00 PM · Online", type: "Mentorship", location: "Online" },
    { id: "cal_4", date: "2026-07-19", title: "Power Team Meetup", timeLabel: "10:00 AM · Manchester", type: "In-Person", location: "Manchester" },
    { id: "cal_5", date: "2026-07-24", title: "Community Call", timeLabel: "12:30 PM · Online", type: "Mentorship", location: "Online" },
    { id: "cal_6", date: "2026-08-02", title: "Deal Structuring Masterclass", timeLabel: "6:30 PM · Online", type: "Masterclass", location: "Online" },
    { id: "cal_7", date: "2026-08-09", title: "Regional Meetup — Midlands Investors", timeLabel: "11:00 AM · Birmingham", type: "In-Person", location: "Birmingham" },
    { id: "cal_8", date: "2026-08-16", title: "New Member Orientation", timeLabel: "5:00 PM · Online", type: "Mentorship", location: "Online" },
    { id: "cal_9", date: "2026-08-21", title: "Live Mentorship Q&A with Michael Adeyemi", timeLabel: "6:00 PM · Online", type: "Mentorship", location: "Online" },
    { id: "cal_10", date: "2026-09-05", title: "Refinancing Masterclass Replay", timeLabel: "58 min · On-Demand", type: "Masterclass", location: "Online" },
    { id: "cal_11", date: "2026-09-12", title: "Power Team Meetup — Solicitors & Brokers", timeLabel: "10:00 AM · Manchester", type: "In-Person", location: "Manchester" },
    { id: "cal_12", date: "2026-09-19", title: "Monthly Community Call", timeLabel: "6:00 PM · Online", type: "Mentorship", location: "Online" },
  ],
};
