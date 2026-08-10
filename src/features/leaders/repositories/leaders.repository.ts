import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { Leader, LeaderRegion } from "@/features/leaders/types";

export class LeaderNotFoundError extends Error {}

export interface LeadersQuery {
  region: LeaderRegion | "All";
  search: string;
  page: number;
  limit: number;
}

interface BackendLeader {
  _id: string;
  fullName: string;
  specialty: string;
  specialties: string[];
  region: LeaderRegion;
  location: string;
  yearsActive: number;
  isTopMentor: boolean;
  email: string;
  profileImageUrl: string;
  bio: string;
}

function initialsFor(fullName: string): string {
  return (
    fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "PL"
  );
}

function toLeader(l: BackendLeader): Leader {
  return {
    id: l._id,
    name: l.fullName,
    initials: initialsFor(l.fullName),
    specialtyBadge: l.specialty,
    region: l.region,
    location: l.location,
    profileImageUrl: l.profileImageUrl || undefined,
    isTopMentor: l.isTopMentor,
    bio: l.bio,
    specialties: l.specialties,
    yearsActive: l.yearsActive,
    email: l.email,
  };
}

export const leadersRepository = {
  async getLeadersPage(query: LeadersQuery): Promise<ApiPaginated<Leader>> {
    const { data } = await apiClient.get<ApiPaginated<BackendLeader>>("/leaders", {
      params: { region: query.region, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toLeader), pagination: data.pagination };
  },

  async getLeaderById(id: string): Promise<ApiSuccess<Leader>> {
    try {
      const { data } = await apiClient.get<ApiSuccess<BackendLeader>>(`/leaders/${id}`);
      return { success: true, message: data.message, data: toLeader(data.data) };
    } catch {
      throw new LeaderNotFoundError(`No leader found for id ${id}`);
    }
  },
};
