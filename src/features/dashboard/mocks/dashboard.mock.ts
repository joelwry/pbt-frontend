import type { ApiSuccess } from "@/types/api";
import type { DashboardData } from "@/features/dashboard/types";

export const dashboardMock: ApiSuccess<DashboardData> = {
  success: true,
  message: "Dashboard data retrieved successfully",
  data: {
    memberFirstName: "Kudirat",
    stats: {
      lessonsCompleted: 48,
      lessonsCompletedDeltaLabel: "+12 this month",
      studyHours: 31.5,
      studyHoursDeltaLabel: "+6.5 this week",
      contentUnlocked: 24,
      contentUnlockedTotal: 38,
      nextUnlockInDays: 5,
      nextUnlockLabel: "New lesson",
    },
    programmeProgress: {
      overallPercent: 68,
      encouragement: "Keep going! You're doing excellent.",
      completed: 24,
      unlockedInProgress: 8,
      upcoming: 6,
      totalThisYear: 38,
      programmeLabel: "2026 Programme",
    },
    continueLearning: {
      id: "lesson_deal_analysis",
      category: "This week's lesson",
      title: "Property Deal Analysis — Reading the Numbers",
      type: "Video",
      unlockedLabel: "Unlocked 3 days ago",
      availabilityLabel: "Available until next unlock",
      progressPercent: 65,
      timeLeftLabel: "32 mins left",
    },
    quickAccess: [
      { id: "qa_learning", label: "Learning Hub", description: "Browse this year", href: "/my-learning", icon: "learning" },
      { id: "qa_resources", label: "Resource Library", description: "Templates & guides", href: "/resources", icon: "resources" },
      { id: "qa_community", label: "My Community", description: "Join discussions", href: "/community", icon: "community" },
      { id: "qa_events", label: "Events", description: "Upcoming sessions", href: "/events", icon: "events" },
    ],
    upcomingEvents: [
      {
        id: "evt_1",
        day: "02",
        month: "JUL",
        title: "Property Deal Analysis Live Q&A",
        timeLabel: "7:00 PM – 8:30 PM (GMT)",
        format: "Live Online",
      },
      {
        id: "evt_2",
        day: "08",
        month: "JUL",
        title: "Monthly Community Call",
        timeLabel: "6:00 PM – 7:30 PM (GMT)",
        format: "Live Online",
      },
      {
        id: "evt_3",
        day: "15",
        month: "JUL",
        title: "Build & Scale Workshop",
        timeLabel: "10:00 AM – 1:00 PM (GMT)",
        format: "Workshop",
      },
    ],
    communityActivity: [
      {
        id: "act_1",
        authorName: "Tunde A.",
        message: "posted in Deal Analysis — new framework for calculating BRRR…",
        timeAgoLabel: "2h ago",
        kind: "post",
      },
      {
        id: "act_2",
        authorName: "New announcement",
        message: "June Mastermind — join us for an exclusive session…",
        timeAgoLabel: "4h ago",
        kind: "announcement",
      },
      {
        id: "act_3",
        authorName: "Sarah O.",
        message: "replied in Rent to Rent — great insights, I've used a similar…",
        timeAgoLabel: "6h ago",
        kind: "reply",
      },
    ],
  },
};
