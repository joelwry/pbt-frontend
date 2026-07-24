import type { ApiSuccess } from "@/types/api";
import type { AdminEvent, AdminEventsStats } from "@/features/admin-events/types";

export const adminEventsStatsMock: ApiSuccess<AdminEventsStats> = {
  success: true,
  message: "Event stats retrieved successfully",
  data: {
    upcomingCount: 4,
    totalRsvps: 295,
    inPersonCount: 1,
    inPersonNextLabel: "19 Jul",
    completedCount: 28,
    yearLabel: "2026",
  },
};

export const adminEventsMock: AdminEvent[] = [
  {
    id: "evt_1", title: "Property Deal Analysis Live Q&A", date: "2026-07-02", startTime: "19:00", endTime: "20:30",
    type: "Live Online", rsvpCount: 38, capacity: 100, status: "Upcoming",
    location: "Online — link sent 1 hour before start",
    description: "A live Q&A session breaking down real property deal analysis with a PBT Leader.",
    visibility: "all",
  },
  {
    id: "evt_2", title: "Monthly Community Call", date: "2026-07-08", startTime: "18:00", endTime: "19:30",
    type: "Live Online", rsvpCount: 112, capacity: 150, status: "Upcoming",
    location: "Online — link sent 1 hour before start",
    description: "Our monthly open call covering community wins, announcements and Q&A.",
    visibility: "all",
  },
  {
    id: "evt_3", title: "Build & Scale Workshop", date: "2026-07-15", startTime: "10:00", endTime: "13:00",
    type: "Workshop", rsvpCount: 34, capacity: 40, status: "Upcoming",
    location: "Online — link sent 1 hour before start",
    description: "A hands-on workshop covering how to scale a portfolio past the first few units without over-leveraging.",
    visibility: "all",
  },
  {
    id: "evt_4", title: "Power Team Meetup — Manchester", date: "2026-07-19", startTime: "10:00", endTime: "12:00",
    type: "In-Person", rsvpCount: 22, capacity: 60, status: "Upcoming",
    location: "Manchester — venue details sent on RSVP",
    description: "An in-person meetup with vetted solicitors, brokers and surveyors from the Power Team.",
    visibility: "all",
  },
  {
    id: "evt_5", title: "Q2 Mentorship Q&A", date: "2026-06-14", startTime: "18:00", endTime: "19:00",
    type: "Live Online", rsvpCount: 89, capacity: 100, status: "Completed",
    location: "Online",
    description: "Quarterly open Q&A exclusively for Mentorship members.",
    visibility: "mentorship",
  },
  {
    id: "evt_6", title: "Deal Structuring Masterclass", date: "2026-08-02", startTime: "18:30", endTime: "20:00",
    type: "Live Online", rsvpCount: 12, capacity: 100, status: "Upcoming",
    location: "Online — link sent 1 hour before start",
    description: "A masterclass covering creative finance and deal structuring options.",
    visibility: "plus-mentorship",
  },
  {
    id: "evt_7", title: "Regional Meetup — Midlands Investors", date: "2026-08-09", startTime: "11:00", endTime: "13:00",
    type: "In-Person", rsvpCount: 9, capacity: 50, status: "Upcoming",
    location: "Birmingham — venue details sent on RSVP",
    description: "A regional meetup for investors across the Midlands.",
    visibility: "all",
  },
  {
    id: "evt_8", title: "New Member Orientation", date: "2026-08-16", startTime: "17:00", endTime: "17:45",
    type: "Live Online", rsvpCount: 4, capacity: 200, status: "Upcoming",
    location: "Online — link sent 1 hour before start",
    description: "An orientation session for members who joined in the last month.",
    visibility: "all",
  },
  {
    id: "evt_9", title: "Refinancing Masterclass", date: "2026-05-14", startTime: "18:30", endTime: "20:00",
    type: "Live Online", rsvpCount: 96, capacity: 100, status: "Completed",
    location: "Online",
    description: "A masterclass on refinancing strategy in a high-rate market.",
    visibility: "all",
  },
  {
    id: "evt_10", title: "First HMO Walkthrough Webinar", date: "2026-05-22", startTime: "18:00", endTime: "19:00",
    type: "Live Online", rsvpCount: 71, capacity: 100, status: "Completed",
    location: "Online",
    description: "A recorded walkthrough of a first-time HMO conversion project.",
    visibility: "all",
  },
  {
    id: "evt_11", title: "Power Team Meetup — Liverpool", date: "2026-04-18", startTime: "10:00", endTime: "12:00",
    type: "In-Person", rsvpCount: 41, capacity: 45, status: "Completed",
    location: "Liverpool",
    description: "An in-person meetup with Power Team partners across Merseyside.",
    visibility: "all",
  },
  {
    id: "evt_12", title: "Scaling Sprint Workshop", date: "2026-04-11", startTime: "10:00", endTime: "13:00",
    type: "Workshop", rsvpCount: 38, capacity: 40, status: "Completed",
    location: "Online — link sent 1 hour before start",
    description: "A focused workshop on scaling from 5 to 15 units.",
    visibility: "plus-mentorship",
  },
];
