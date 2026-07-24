import type { ApiSuccess } from "@/types/api";
import type { MentorshipPageData, MentorshipCall } from "@/features/mentorship/types";

export const mentorshipPageMock: ApiSuccess<MentorshipPageData> = {
  success: true,
  message: "PBT Mentorship page retrieved successfully",
  data: {
    tagline: "Your Active Plan",
    headline: "PBT Mentorship — 1:1 guidance from a dedicated Leader.",
    description:
      "Everything in PBT Plus, plus monthly 1:1 mentorship calls, direct message access to your assigned Leader, and early access to new programme releases.",
    renewsLabel: "1 Sept 2026",
    benefits: [
      { id: "b1", title: "Monthly 1:1 Mentorship Calls", description: "45-minute sessions with your assigned Leader, booked directly from your dashboard." },
      { id: "b2", title: "Early Access to New Releases", description: "See new modules and toolkits before they reach Pathway and Plus members." },
      { id: "b3", title: "Personalised Portfolio Review", description: "Quarterly review of your deal pipeline and growth targets." },
      { id: "b4", title: "Mentorship Circle Community", description: "A smaller, closed discussion group exclusive to Mentorship members." },
    ],
    assignedMentor: {
      name: "Michael Adeyemi",
      initials: "MA",
      regionLabel: "PBT Leader · Greater Manchester",
      badgeLabel: "Top Mentor 2026",
    },
  },
};

export const mentorshipCallsMock: MentorshipCall[] = [
  { id: "call_1", dateLabel: "14 Jul 2026, 4:00 PM", topic: "Q3 Portfolio Review", mentorName: "Michael Adeyemi", status: "Confirmed" },
  { id: "call_2", dateLabel: "11 Aug 2026, 4:00 PM", topic: "Refinance Strategy", mentorName: "Michael Adeyemi", status: "Scheduled" },
  { id: "call_3", dateLabel: "8 Sep 2026, 4:00 PM", topic: "Deal Pipeline Check-In", mentorName: "Michael Adeyemi", status: "Scheduled" },
  { id: "call_4", dateLabel: "6 Oct 2026, 4:00 PM", topic: "Year-End Planning", mentorName: "Michael Adeyemi", status: "Scheduled" },
  { id: "call_5", dateLabel: "12 May 2026, 4:00 PM", topic: "HMO Conversion Review", mentorName: "Michael Adeyemi", status: "Cancelled" },
];
