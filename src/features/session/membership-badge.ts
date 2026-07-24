import { Crown, Sparkles, Layers } from "lucide-react";
import type { MembershipTier } from "@/features/session/types";

export const MEMBERSHIP_BADGE: Record<
  MembershipTier,
  { label: string; icon: typeof Crown; badgeClass: string }
> = {
  Pathway: {
    label: "PBT Pathway",
    icon: Layers,
    badgeClass: "bg-[#F1F5F9] text-slate-500",
  },
  Plus: {
    label: "PBT Plus",
    icon: Sparkles,
    badgeClass: "bg-sky-tint text-sky-600",
  },
  Mentorship: {
    label: "PBT Mentorship",
    icon: Crown,
    badgeClass: "bg-orange-tint text-orange-500",
  },
};
