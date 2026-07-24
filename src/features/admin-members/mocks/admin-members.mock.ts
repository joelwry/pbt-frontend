import type { ApiSuccess } from "@/types/api";
import type { AdminMemberDetail, AdminMembersStats } from "@/features/admin-members/types";

export const adminMembersStatsMock: ApiSuccess<AdminMembersStats> = {
  success: true,
  message: "Member stats retrieved successfully",
  data: {
    totalMembers: 1284,
    totalMembersDeltaLabel: "+18",
    newMembersThisWeek: 24,
    failedPayments: 7,
    pausedAccounts: 5,
  },
};

function activityFor(prefix: string): AdminMemberDetail["recentActivity"] {
  return [
    { id: `act_${prefix}_1`, icon: "lesson", description: "Completed a lesson in My Learning", timeAgoLabel: "3 days ago" },
    { id: `act_${prefix}_2`, icon: "community", description: "Posted in Community", timeAgoLabel: "5 days ago" },
    { id: `act_${prefix}_3`, icon: "event", description: "RSVP'd to an upcoming event", timeAgoLabel: "1 week ago" },
  ];
}

/** First six mirror the Member Management screen exactly. */
const featuredMembers: AdminMemberDetail[] = [
  {
    id: "mem_sarah", clientId: "PBT-04512", fullName: "Sarah Okonkwo", initials: "SO", email: "sarah.o@email.com",
    tier: "Mentorship", joinedLabel: "1 Jul 2026", status: "Active", contractLabel: "12-mo renewable",
    phone: "+44 7700 900201", location: "London, United Kingdom", assignedLeader: "Michael Adeyemi",
    renewalDateLabel: "1 Jul 2027", paymentMethodLabel: "Visa •••• 2210", memberSinceLabel: "1 Jul 2026",
    contractTypeLabel: "12-mo", lessonsCompleted: 6, studyHours: 4.5, recentActivity: activityFor("sarah"),
  },
  {
    id: "mem_david", clientId: "PBT-04498", fullName: "David Mensah", initials: "DM", email: "d.mensah@email.com",
    tier: "Plus", joinedLabel: "29 Jun 2026", status: "Active", contractLabel: "6-mo contract",
    phone: "+44 7700 900202", location: "Birmingham, United Kingdom", assignedLeader: "Sarah Bello",
    renewalDateLabel: "29 Dec 2026", paymentMethodLabel: "Mastercard •••• 5521", memberSinceLabel: "29 Jun 2026",
    contractTypeLabel: "6-mo", lessonsCompleted: 4, studyHours: 3.2, recentActivity: activityFor("david"),
  },
  {
    id: "mem_ruth", clientId: "PBT-04487", fullName: "Ruth Adeyemi", initials: "RA", email: "ruth.a@email.com",
    tier: "Pathway", joinedLabel: "28 Jun 2026", status: "Active", contractLabel: "No contract",
    phone: "+44 7700 900203", location: "Leeds, United Kingdom", assignedLeader: "Tunde Grant",
    renewalDateLabel: "—", paymentMethodLabel: "Visa •••• 7789", memberSinceLabel: "28 Jun 2026",
    contractTypeLabel: "None", lessonsCompleted: 2, studyHours: 1.4, recentActivity: activityFor("ruth"),
  },
  {
    id: "mem_01H8X9", clientId: "PBT-04231", fullName: "Kudirat Olowosale", initials: "KO", email: "kudirat@olowosaleproperty.co.uk",
    tier: "Mentorship", joinedLabel: "12 Jan 2024", status: "Active", contractLabel: "12-mo renewable",
    phone: "+44 7700 900123", location: "Manchester, United Kingdom", assignedLeader: "Michael Adeyemi",
    renewalDateLabel: "1 Sept 2026", paymentMethodLabel: "Visa •••• 4471", memberSinceLabel: "12 Jan 2024",
    contractTypeLabel: "12-mo", lessonsCompleted: 48, studyHours: 31.5,
    recentActivity: [
      { id: "act_ko_1", icon: "lesson", description: "Completed lesson: Creative Finance Options", timeAgoLabel: "2 days ago" },
      { id: "act_ko_2", icon: "community", description: "Posted in Community: Deal Analysis", timeAgoLabel: "4 days ago" },
      { id: "act_ko_3", icon: "event", description: "RSVP'd to Build & Scale Workshop", timeAgoLabel: "1 week ago" },
    ],
  },
  {
    id: "mem_tunde", clientId: "PBT-03920", fullName: "Tunde Grant", initials: "TG", email: "tunde.grant@email.com",
    tier: "Plus", joinedLabel: "3 Nov 2025", status: "Payment Failed", contractLabel: "6-mo contract",
    phone: "+44 7700 900205", location: "Yorkshire, United Kingdom", assignedLeader: "Emeka Okafor",
    renewalDateLabel: "3 May 2026 (overdue)", paymentMethodLabel: "Visa •••• 3391 (expired)", memberSinceLabel: "3 Nov 2025",
    contractTypeLabel: "6-mo", lessonsCompleted: 22, studyHours: 15.8, recentActivity: activityFor("tunde"),
  },
  {
    id: "mem_michelle", clientId: "PBT-03811", fullName: "Michelle Bassey", initials: "MB", email: "michelle.b@email.com",
    tier: "Pathway", joinedLabel: "20 Oct 2025", status: "Paused", contractLabel: "No contract",
    phone: "+44 7700 900206", location: "Cardiff, United Kingdom", assignedLeader: "Sarah Bello",
    renewalDateLabel: "—", paymentMethodLabel: "Visa •••• 6612", memberSinceLabel: "20 Oct 2025",
    contractTypeLabel: "None", lessonsCompleted: 9, studyHours: 6.1, recentActivity: activityFor("michelle"),
  },
];

const FIRST_NAMES = ["Priya", "James", "Fiona", "Oliver", "Emeka", "Laura", "Daniel", "Amara", "Chidi", "Grace", "Femi", "Bola", "Chloe", "Segun", "Nkem", "Yemi", "Tolu", "Bisi", "Kelechi", "Ifeoma"];
const LAST_NAMES = ["Sharma", "Whitfield", "Campbell", "Bennett", "Okafor", "Chapman", "Price", "Hussain", "Nwosu", "Adebayo", "Balogun", "Eze", "Johnson", "Afolabi", "Uche", "Olawale", "Ajayi", "Nnamdi", "Okoro", "Chukwu"];
const TIERS: Array<"Pathway" | "Plus" | "Mentorship"> = ["Pathway", "Plus", "Mentorship"];
const CONTRACT_BY_TIER: Record<string, string> = { Pathway: "No contract", Plus: "6-mo contract", Mentorship: "12-mo renewable" };

const generatedMembers: AdminMemberDetail[] = FIRST_NAMES.map((first, i) => {
  const last = LAST_NAMES[i];
  const tier = TIERS[i % 3];
  return {
    id: `admin_mem_${i + 1}`,
    clientId: `PBT-0${4500 + i}`,
    fullName: `${first} ${last}`,
    initials: `${first[0]}${last[0]}`,
    email: `${first.toLowerCase()}.${last[0].toLowerCase()}@email.com`,
    tier,
    joinedLabel: `${28 - (i % 27)} ${i < 10 ? "Jun" : "May"} 2026`,
    status: "Active",
    contractLabel: CONTRACT_BY_TIER[tier],
    phone: `+44 77${String(100000000 + i * 137).slice(0, 8)}`,
    location: ["Manchester", "Birmingham", "London", "Leeds", "Liverpool", "Bristol", "Glasgow", "Cardiff"][i % 8] + ", United Kingdom",
    assignedLeader: ["Michael Adeyemi", "Sarah Bello", "Tunde Grant", "Emeka Okafor"][i % 4],
    renewalDateLabel: "1 " + ["Aug", "Sep", "Oct"][i % 3] + " 2026",
    paymentMethodLabel: `Visa •••• ${4000 + i * 37}`,
    memberSinceLabel: `${(i % 27) + 1} ${["Jan", "Mar", "May", "Jul", "Sep", "Nov"][i % 6]} ${2024 + (i % 2)}`,
    contractTypeLabel: tier === "Pathway" ? "None" : tier === "Plus" ? "6-mo" : "12-mo",
    lessonsCompleted: 12 + i * 3,
    studyHours: Math.round((8 + i * 2.4) * 10) / 10,
    recentActivity: activityFor(`gen${i}`),
  };
});

export const adminMembersMock: AdminMemberDetail[] = [...featuredMembers, ...generatedMembers];
