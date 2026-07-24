import type { ApiSuccess } from "@/types/api";
import type { PlusPageData } from "@/features/plus/types";

export const plusPageMock: ApiSuccess<PlusPageData> = {
  success: true,
  message: "PBT Plus page retrieved successfully",
  data: {
    tagline: "PBT Plus",
    headline: "The next step up from the Pathway programme.",
    description:
      "Full learning library access, live group coaching, and priority event booking — built for investors ready to scale beyond their first deal.",
    benefits: [
      { id: "b1", title: "Full Learning Library", description: "Every module across Foundations, Deal Structuring and Portfolio Growth pathways." },
      { id: "b2", title: "Monthly Group Coaching", description: "Live group sessions with PBT Leaders, recorded for later viewing." },
      { id: "b3", title: "Priority Event Booking", description: "Reserve your seat before general release for in-person meetups." },
      { id: "b4", title: "Deal Analysis Templates", description: "Full toolkit access inside Resources, updated quarterly." },
      { id: "b5", title: "Power Team Directory", description: "Direct introductions to vetted solicitors, brokers and surveyors." },
    ],
  },
};
