import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  GraduationCap,
  Users,
  MapPin,
  Handshake,
  Calendar,
  Ticket,
  FolderOpen,
  Sparkles,
  Crown,
  UserCircle,
  CreditCard,
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

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "My Learning", href: "/my-learning", icon: GraduationCap },
      { label: "Community", href: "/community", icon: Users },
      { label: "PBT Leaders", href: "/pbt-leaders", icon: MapPin },
      { label: "Power Team", href: "/power-team", icon: Handshake },
      { label: "Calendar", href: "/calendar", icon: Calendar },
      { label: "Events", href: "/events", icon: Ticket },
      { label: "Resources", href: "/resources", icon: FolderOpen },
    ],
  },
  {
    label: "Premium",
    items: [
      { label: "PBT Plus", href: "/pbt-plus", icon: Sparkles },
      { label: "PBT Mentorship", href: "/pbt-mentorship", icon: Crown },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "My Subscription", href: "/my-subscription", icon: CreditCard },
    ],
  },
];
