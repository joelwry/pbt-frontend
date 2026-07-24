export type PartnerCategory = "Solicitors" | "Mortgage Brokers" | "Accountants" | "Surveyors" | "Letting Agents";

export interface Partner {
  id: string;
  name: string;
  initials: string;
  category: PartnerCategory;
  categoryLabel: string;
  city: string;
  verified: boolean;
  bio: string;
  phone: string;
  email: string;
  website: string;
}
