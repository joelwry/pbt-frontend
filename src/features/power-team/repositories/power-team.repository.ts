import { apiClient } from "@/lib/api-client";
import type { ApiPaginated } from "@/types/api";
import type { Partner, PartnerCategory } from "@/features/power-team/types";

export interface PartnersQuery {
  category: PartnerCategory | "All";
  search: string;
  page: number;
  limit: number;
}

interface BackendPartner {
  _id: string;
  name: string;
  category: PartnerCategory;
  categoryLabel: string;
  region: string;
  isVerified: boolean;
  bio: string;
  phone: string;
  contactEmail: string;
  website: string;
  logoUrl: string;
}

function initialsFor(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "PT"
  );
}

function toPartner(p: BackendPartner): Partner {
  return {
    id: p._id,
    name: p.name,
    initials: initialsFor(p.name),
    category: p.category,
    categoryLabel: p.categoryLabel,
    city: p.region,
    verified: p.isVerified,
    bio: p.bio,
    phone: p.phone,
    email: p.contactEmail,
    website: p.website,
    logoUrl: p.logoUrl || undefined,
  };
}

export const powerTeamRepository = {
  async getPartnersPage(query: PartnersQuery): Promise<ApiPaginated<Partner>> {
    const { data } = await apiClient.get<ApiPaginated<BackendPartner>>("/power-team", {
      params: { category: query.category, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toPartner), pagination: data.pagination };
  },
};
