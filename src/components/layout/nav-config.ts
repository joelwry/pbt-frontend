import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  GraduationCap,
  Users,
  MapPin,
  Calendar,
  Ticket,
  FolderOpen,
  ExternalLink,
  Sparkles,
  Crown,
  UserCircle,
  CreditCard,
  Gift,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// Power Team is intentionally not a nav item -- per client direction it's
// restricted to Plus/Masterplan members and discovered via those tiers'
// pages (see MEMBERSHIP_TIERS features) rather than a top-level link
// available to everyone including Pathway members.
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "PBT Pathway", href: "/pbt-pathway", icon: GraduationCap },
      { label: "Events", href: "/events", icon: Ticket },
      { label: "Resources", href: "/resources", icon: FolderOpen },
      { label: "PBT Leaders", href: "/pbt-leaders", icon: MapPin },
      { label: "Community Group", href: "/community", icon: Users },
      { label: "Facebook Group", href: "/facebook-group", icon: ExternalLink },
      { label: "Calendar", href: "/calendar", icon: Calendar },
    ],
  },
  {
    label: "Premium",
    items: [
      { label: "PBT Plus", href: "/pbt-plus", icon: Sparkles },
      { label: "PBT Masterplan Programme", href: "/pbt-masterplan", icon: Crown },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "My Subscription", href: "/my-subscription", icon: CreditCard },
      { label: "Referral Hub", href: "/referral-hub", icon: Gift },
    ],
  },
];
