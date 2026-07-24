import type { ApiSuccess } from "@/types/api";
import type { AdminDashboardData } from "@/features/admin-dashboard/types";

export const adminDashboardMock: ApiSuccess<AdminDashboardData> = {
  success: true,
  message: "Admin dashboard data retrieved successfully",
  data: {
    adminFirstName: "Amaka",
    stats: {
      activeMembers: 1284,
      activeMembersDeltaLabel: "+18 this month",
      mrrLabel: "£62,140",
      mrrDeltaLabel: "+3.2%",
      lessonsPublished: 142,
      lessonsPublishedYearLabel: "Lessons Published (2026)",
      lessonsUnlockThisWeekLabel: "5 unlock this week",
      communityPosts: 346,
      communityPostsTodayLabel: "12 today",
    },
    membershipBreakdown: {
      totalMembers: 1284,
      yearLabel: "2026",
      segments: [
        { tier: "Pathway", label: "PBT Pathway (no contract)", percent: 28 },
        { tier: "Plus", label: "PBT Plus (6-mo)", percent: 42 },
        { tier: "Mentorship", label: "PBT Mentorship (12-mo)", percent: 30 },
      ],
    },
    recentlyJoined: [
      { id: "mem_r1", fullName: "Sarah Okonkwo", initials: "SO", email: "sarah.o@email.com", tier: "Mentorship", joinedLabel: "1 Jul 2026", status: "Active" },
      { id: "mem_r2", fullName: "David Mensah", initials: "DM", email: "d.mensah@email.com", tier: "Plus", joinedLabel: "29 Jun 2026", status: "Active" },
      { id: "mem_r3", fullName: "Ruth Adeyemi", initials: "RA", email: "ruth.a@email.com", tier: "Pathway", joinedLabel: "28 Jun 2026", status: "Active" },
    ],
    needsAttention: [
      {
        id: "att_1",
        icon: "flag",
        title: "2 community posts flagged for review",
        subtitle: "Community moderation queue",
        href: "/admin/community",
      },
      {
        id: "att_2",
        icon: "payment",
        title: "1 failed payment — Mentorship renewal",
        subtitle: "Subscriptions & Billing",
        href: "/admin/subscriptions",
      },
      {
        id: "att_3",
        icon: "event",
        title: "Build & Scale Workshop — 34 RSVPs, capacity 40",
        subtitle: "Events",
        href: "/admin/events",
      },
    ],
    upcomingUnlocks: [
      { id: "unlock_1", day: "08", month: "JUL", title: "Bridging Loans Explained", moduleLabel: "Module 2 · Deal Structuring & Finance", badgeLabel: "Scheduled" },
      { id: "unlock_2", day: "15", month: "JUL", title: "Joint Venture Structures", moduleLabel: "Module 2 · Deal Structuring & Finance", badgeLabel: "Scheduled" },
      { id: "unlock_3", day: "22", month: "JUL", title: "Scaling From 1 to 10 Units", moduleLabel: "Module 3 · Portfolio Growth", badgeLabel: "Scheduled" },
    ],
  },
};
