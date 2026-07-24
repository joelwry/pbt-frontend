import type { ApiSuccess } from "@/types/api";
import type { EventItem } from "@/features/events/types";

export const eventsMock: ApiSuccess<EventItem[]> = {
  success: true,
  message: "Events retrieved successfully",
  data: [
    { id: "evt_1", date: "2026-07-14", title: "Live Mentorship Q&A with Michael Adeyemi", timeLabel: "6:00 PM · Online", location: "Online", category: "Mentorship", rsvped: true, rsvpDetails: { guestCount: 1, notes: "" } },
    { id: "evt_2", date: "2026-07-19", title: "Power Team Meetup — Solicitors & Brokers", timeLabel: "10:00 AM · Manchester", location: "Manchester", category: "In-Person", rsvped: false },
    { id: "evt_3", date: "2026-07-24", title: "Community Call — Q3 Wins & Progress", timeLabel: "12:30 PM · Online", location: "Online", category: "Community", rsvped: true, rsvpDetails: { guestCount: 1, notes: "" } },
    { id: "evt_4", date: "2026-08-02", title: "Deal Structuring Masterclass", timeLabel: "6:30 PM · Online", location: "Online", category: "Masterclass", rsvped: false },
    { id: "evt_5", date: "2026-08-09", title: "Regional Meetup — Midlands Investors", timeLabel: "11:00 AM · Birmingham", location: "Birmingham", category: "In-Person", rsvped: false },
    { id: "evt_6", date: "2026-08-16", title: "New Member Orientation", timeLabel: "5:00 PM · Online", location: "Online", category: "Onboarding", rsvped: false },
    { id: "evt_7", date: "2026-08-21", title: "Refinancing Q&A", timeLabel: "6:00 PM · Online", location: "Online", category: "Mentorship", rsvped: false },
    { id: "evt_8", date: "2026-09-05", title: "Refinancing Masterclass Replay", timeLabel: "6:30 PM · Online", location: "Online", category: "Masterclass", rsvped: false },
    { id: "evt_9", date: "2026-09-12", title: "Power Team Meetup — North West", timeLabel: "10:00 AM · Liverpool", location: "Liverpool", category: "In-Person", rsvped: false },
    { id: "evt_10", date: "2026-09-19", title: "Monthly Community Call", timeLabel: "6:00 PM · Online", location: "Online", category: "Community", rsvped: false },
    { id: "evt_11", date: "2026-05-14", title: "Spring Mentorship Q&A", timeLabel: "6:00 PM · Online", location: "Online", category: "Mentorship", rsvped: false },
    { id: "evt_12", date: "2026-05-22", title: "Regional Meetup — London", timeLabel: "11:00 AM · London", location: "London", category: "In-Person", rsvped: false },
    { id: "evt_13", date: "2026-06-04", title: "Deal Sourcing Masterclass", timeLabel: "6:30 PM · Online", location: "Online", category: "Masterclass", rsvped: false },
    { id: "evt_14", date: "2026-06-18", title: "Community Call — Q2 Wins", timeLabel: "12:30 PM · Online", location: "Online", category: "Community", rsvped: false },
  ],
};
