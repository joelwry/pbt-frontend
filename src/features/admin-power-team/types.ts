export type AdminPartnerStatus = "Verified" | "Pending Review" | "Suspended";
export type AdminPartnerCategory = "Solicitors" | "Mortgage Brokers" | "Accountants" | "Surveyors" | "Letting Agents";

export interface AdminPartner {
  id: string;
  name: string;
  initials: string;
  category: AdminPartnerCategory;
  categoryLabel: string;
  region: string;
  status: AdminPartnerStatus;
  email: string;
  phone: string;
  bio: string;
  website: string;
  logoUrl: string;
}

export interface AdminPowerTeamStats {
  totalPartners: number;
  serviceTypesCount: number;
  pendingCount: number;
  regionsCount: number;
}
