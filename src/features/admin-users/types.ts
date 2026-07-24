import type { AdminRole, AdminSection } from "@/features/admin-auth/types";

export type AdminAccountStatus = "Active" | "Invited";

export interface AdminAccount {
  id: string;
  adminId: string;
  fullName: string;
  initials: string;
  email: string;
  role: AdminRole;
  sections: AdminSection[];
  status: AdminAccountStatus;
  /** Optional short qualifier shown after the access scope, e.g. "(View Only)". */
  accessNote?: string;
}

export interface AdminUsersStats {
  superAdminsCount: number;
  staffAccountsCount: number;
  invitedNotActiveCount: number;
  roleChangesCount: number;
}
