import type { ApiSuccess } from "@/types/api";
import type { SubscriptionStats, RevenueByTier, Invoice } from "@/features/admin-subscriptions/types";

export const subscriptionStatsMock: ApiSuccess<SubscriptionStats> = {
  success: true,
  message: "Subscription stats retrieved successfully",
  data: { mrr: 62140, mrrDeltaLabel: "3.2%", payingMembers: 1284, failedPaymentsCount: 7, churnRatePercent: 2.1 },
};

export const revenueByTierMock: ApiSuccess<RevenueByTier> = {
  success: true,
  message: "Revenue by tier retrieved successfully",
  data: {
    mrrLabel: "£62.1k",
    segments: [
      { tier: "Pathway", label: "PBT Pathway — £39/mo", priceLabel: "£39/mo", percent: 14 },
      { tier: "Plus", label: "PBT Plus — £79/mo", priceLabel: "£79/mo", percent: 38 },
      { tier: "Mentorship", label: "PBT Mentorship — £149/mo", priceLabel: "£149/mo", percent: 48 },
    ],
  },
};

export const invoicesMock: Invoice[] = [
  { id: "inv_1", invoiceNumber: "INV-2026-0712", memberName: "Kudirat Olowosale", memberInitials: "KO", tier: "Mentorship", amount: 149, dateLabel: "1 Jul 2026", status: "Paid" },
  { id: "inv_2", invoiceNumber: "INV-2026-0711", memberName: "Tunde Grant", memberInitials: "TG", tier: "Plus", amount: 79, dateLabel: "1 Jul 2026", status: "Failed" },
  { id: "inv_3", invoiceNumber: "INV-2026-0710", memberName: "Sarah Okonkwo", memberInitials: "SO", tier: "Mentorship", amount: 149, dateLabel: "1 Jul 2026", status: "Paid" },
  { id: "inv_4", invoiceNumber: "INV-2026-0709", memberName: "Ruth Adeyemi", memberInitials: "RA", tier: "Pathway", amount: 39, dateLabel: "28 Jun 2026", status: "Paid" },
  { id: "inv_5", invoiceNumber: "INV-2026-0708", memberName: "David Okafor", memberInitials: "DO", tier: "Plus", amount: 79, dateLabel: "27 Jun 2026", status: "Paid" },
  { id: "inv_6", invoiceNumber: "INV-2026-0707", memberName: "Grace Adebayo", memberInitials: "GA", tier: "Mentorship", amount: 149, dateLabel: "27 Jun 2026", status: "Refunded" },
  { id: "inv_7", invoiceNumber: "INV-2026-0706", memberName: "James Whitfield", memberInitials: "JW", tier: "Pathway", amount: 39, dateLabel: "26 Jun 2026", status: "Paid" },
  { id: "inv_8", invoiceNumber: "INV-2026-0705", memberName: "Chioma Eze", memberInitials: "CE", tier: "Plus", amount: 79, dateLabel: "25 Jun 2026", status: "Failed" },
  { id: "inv_9", invoiceNumber: "INV-2026-0704", memberName: "Michael Osei", memberInitials: "MO", tier: "Mentorship", amount: 149, dateLabel: "24 Jun 2026", status: "Paid" },
  { id: "inv_10", invoiceNumber: "INV-2026-0703", memberName: "Funmilayo Bello", memberInitials: "FB", tier: "Plus", amount: 79, dateLabel: "23 Jun 2026", status: "Paid" },
  { id: "inv_11", invoiceNumber: "INV-2026-0702", memberName: "Daniel Chukwu", memberInitials: "DC", tier: "Pathway", amount: 39, dateLabel: "22 Jun 2026", status: "Paid" },
  { id: "inv_12", invoiceNumber: "INV-2026-0701", memberName: "Amara Nwosu", memberInitials: "AN", tier: "Mentorship", amount: 149, dateLabel: "21 Jun 2026", status: "Paid" },
  { id: "inv_13", invoiceNumber: "INV-2026-0700", memberName: "Oliver Bennett", memberInitials: "OB", tier: "Plus", amount: 79, dateLabel: "20 Jun 2026", status: "Refunded" },
  { id: "inv_14", invoiceNumber: "INV-2026-0699", memberName: "Blessing Uche", memberInitials: "BU", tier: "Mentorship", amount: 149, dateLabel: "19 Jun 2026", status: "Paid" },
  { id: "inv_15", invoiceNumber: "INV-2026-0698", memberName: "Henry Okoro", memberInitials: "HO", tier: "Pathway", amount: 39, dateLabel: "18 Jun 2026", status: "Failed" },
  { id: "inv_16", invoiceNumber: "INV-2026-0697", memberName: "Ngozi Umeh", memberInitials: "NU", tier: "Plus", amount: 79, dateLabel: "17 Jun 2026", status: "Paid" },
  { id: "inv_17", invoiceNumber: "INV-2026-0696", memberName: "Samuel Adeyanju", memberInitials: "SA", tier: "Mentorship", amount: 149, dateLabel: "16 Jun 2026", status: "Paid" },
  { id: "inv_18", invoiceNumber: "INV-2026-0695", memberName: "Patricia Nnamdi", memberInitials: "PN", tier: "Pathway", amount: 39, dateLabel: "15 Jun 2026", status: "Paid" },
  { id: "inv_19", invoiceNumber: "INV-2026-0694", memberName: "Emmanuel Bassey", memberInitials: "EB", tier: "Plus", amount: 79, dateLabel: "14 Jun 2026", status: "Paid" },
  { id: "inv_20", invoiceNumber: "INV-2026-0693", memberName: "Victoria Adeleke", memberInitials: "VA", tier: "Mentorship", amount: 149, dateLabel: "13 Jun 2026", status: "Paid" },
];
