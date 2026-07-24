import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Users,
  GraduationCap,
  FolderOpen,
  Ticket,
  MessageSquare,
  MapPin,
  Handshake,
  CreditCard,
  BarChart3,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import type { AdminSection } from "@/features/admin-auth/types";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** If set, this nav item requires the admin to have this section granted (ignored for Super Admin). */
  section?: AdminSection;
  /** If true, only the Super Admin role can access this item, regardless of granted sections. */
  superAdminOnly?: boolean;
}

export interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    label: "Main Menu",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
      { label: "Members", href: "/admin/members", icon: Users, section: "members" },
      { label: "Content", href: "/admin/content", icon: GraduationCap, section: "content" },
      { label: "Resources", href: "/admin/resources", icon: FolderOpen, section: "resources" },
      { label: "Events", href: "/admin/events", icon: Ticket, section: "events" },
      { label: "Community", href: "/admin/community", icon: MessageSquare, section: "community" },
    ],
  },
  {
    label: "Directories",
    items: [
      { label: "PBT Leaders", href: "/admin/pbt-leaders", icon: MapPin, section: "pbtLeaders" },
      { label: "Power Team", href: "/admin/power-team", icon: Handshake, section: "powerTeam" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Subscriptions & Billing", href: "/admin/subscriptions", icon: CreditCard, section: "subscriptions" },
      { label: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3, section: "analytics" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Admin Users & Roles", href: "/admin/admin-users", icon: ShieldCheck, superAdminOnly: true },
      { label: "Profile", href: "/admin/profile", icon: UserCircle },
    ],
  },
];
