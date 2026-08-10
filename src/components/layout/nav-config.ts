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
  Handshake,
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

// Power Team is a visible nav item for every member -- content access is
// gated by subscription tier on the page itself (PowerTeamGate shows a
// Plus/Masterplan upgrade prompt to a Pathway member), not by hiding the
// link. Reversed from an earlier decision to remove it from the nav
// entirely; the client wants it discoverable, just restricted.
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "PBT Pathway", href: "/pbt-pathway", icon: GraduationCap },
      { label: "Events", href: "/events", icon: Ticket },
      { label: "Resources", href: "/resources", icon: FolderOpen },
      { label: "PBT Leaders", href: "/pbt-leaders", icon: MapPin },
      { label: "Power Team", href: "/power-team", icon: Handshake },
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
