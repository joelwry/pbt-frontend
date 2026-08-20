import type { AdminRole, AdminSection } from "@/features/admin-auth/types";

export type AdminAccountStatus = "Active" | "Invited";

export interface AdminAccount {
  id: string;
  adminId: string;
  fullName: string;
  initials: string;
  email: string;
  role: AdminRole;
  /** Effective access: this role's defaults where nothing was customised, the explicit grants where it was. */
  sections: AdminSection[];
  /**
   * Whether those sections were set explicitly for this account or inherited
   * from its role. False means changing the role re-defaults them; true means
   * the list is deliberate, empty included.
   */
  sectionsCustomised?: boolean;
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
