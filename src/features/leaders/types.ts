export type LeaderRegion = "North West" | "Midlands" | "London & South East" | "Scotland";

export interface Leader {
  id: string;
  name: string;
  initials: string;
  specialtyBadge: string;
  region: LeaderRegion;
  location: string;
  profileUrl: string;
  isTopMentor?: boolean;
  bio: string;
  specialties: string[];
  yearsActive: number;
  email: string;
}
