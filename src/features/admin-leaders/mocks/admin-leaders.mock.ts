import type { ApiSuccess } from "@/types/api";
import type { AdminLeader, AdminLeadersStats } from "@/features/admin-leaders/types";

export const adminLeadersStatsMock: ApiSuccess<AdminLeadersStats> = {
  success: true,
  message: "PBT Leaders stats retrieved successfully",
  data: { totalLeaders: 14, membersCovered: 312, topMentorCount: 1, regionsCount: 8 },
};

export const adminLeadersMock: AdminLeader[] = [
  { id: "ldr_1", fullName: "Michael Adeyemi", initials: "MA", region: "North West", specialty: "Top Mentor 2026", email: "michael.adeyemi@propertybusinesstraining.com", bio: "Michael has built a 40-unit HMO and refinance-focused portfolio across Greater Manchester over the past nine years.", status: "Active", membersAssigned: 48, isTopMentor: true },
  { id: "ldr_2", fullName: "Sarah Bello", initials: "SB", region: "Midlands", specialty: "Portfolio Growth Specialist", email: "sarah.bello@propertybusinesstraining.com", bio: "Sarah scaled from a single buy-to-let to a 22-property portfolio across the West Midlands.", status: "Active", membersAssigned: 34 },
  { id: "ldr_3", fullName: "Tunde Grant", initials: "TG", region: "London & South East", specialty: "New Investor Support", email: "tunde.grant@propertybusinesstraining.com", bio: "Tunde specialises in helping first-time investors get their buy box right.", status: "Active", membersAssigned: 29 },
  { id: "ldr_4", fullName: "Ravinder Kaur", initials: "RK", region: "North West", specialty: "HMO & Conversions", email: "ravinder.kaur@propertybusinesstraining.com", bio: "Ravinder runs a portfolio of licensed HMOs across Yorkshire.", status: "Active", membersAssigned: 26 },
  { id: "ldr_5", fullName: "Emeka Okafor", initials: "EO", region: "Scotland", specialty: "Commercial Property", email: "emeka.okafor@propertybusinesstraining.com", bio: "Emeka focuses on commercial-to-residential conversions across Scotland.", status: "Active", membersAssigned: 21 },
  { id: "ldr_6", fullName: "Laura Chapman", initials: "LC", region: "London & South East", specialty: "Refinance & Finance", email: "laura.chapman@propertybusinesstraining.com", bio: "Laura previously worked as a mortgage broker before becoming a full-time investor.", status: "Active", membersAssigned: 19 },
  { id: "ldr_7", fullName: "Daniel Price", initials: "DP", region: "North West", specialty: "Deal Sourcing", email: "daniel.price@propertybusinesstraining.com", bio: "Daniel sources 15–20 off-market deals a year across the North East.", status: "Active", membersAssigned: 23 },
  { id: "ldr_8", fullName: "Amara Hussain", initials: "AH", region: "Scotland", specialty: "Joint Ventures", email: "amara.hussain@propertybusinesstraining.com", bio: "Amara has completed six joint ventures across Wales.", status: "Inactive", membersAssigned: 12 },
  { id: "ldr_9", fullName: "Priya Sharma", initials: "PS", region: "Midlands", specialty: "Serviced Accommodation", email: "priya.sharma@propertybusinesstraining.com", bio: "Priya runs a portfolio of serviced accommodation units across the East Midlands.", status: "Active", membersAssigned: 17 },
  { id: "ldr_10", fullName: "James Whitfield", initials: "JW", region: "London & South East", specialty: "New Build & Development", email: "james.whitfield@propertybusinesstraining.com", bio: "James moved from single lets into small-scale new-build development.", status: "Active", membersAssigned: 15 },
  { id: "ldr_11", fullName: "Fiona Campbell", initials: "FC", region: "Scotland", specialty: "Rent to Rent", email: "fiona.campbell@propertybusinesstraining.com", bio: "Fiona built her initial cashflow using rent-to-rent HMO agreements across Edinburgh.", status: "Active", membersAssigned: 14 },
  { id: "ldr_12", fullName: "Oliver Bennett", initials: "OB", region: "North West", specialty: "Buy-to-Let Fundamentals", email: "oliver.bennett@propertybusinesstraining.com", bio: "Oliver focuses on straightforward, well-managed single buy-to-lets across Liverpool.", status: "Active", membersAssigned: 20 },
  { id: "ldr_13", fullName: "Grace Adebayo", initials: "GA", region: "Midlands", specialty: "First-Time Landlord Support", email: "grace.adebayo@propertybusinesstraining.com", bio: "Grace mentors first-time landlords through their initial purchase and setup.", status: "Inactive", membersAssigned: 8 },
  { id: "ldr_14", fullName: "Segun Bakare", initials: "SB", region: "London & South East", specialty: "Auction Purchases", email: "segun.bakare@propertybusinesstraining.com", bio: "Segun has purchased over a dozen properties at auction and mentors on the process.", status: "Active", membersAssigned: 16 },
];
