export type AdminLeaderStatus = "Active" | "Inactive";
export type AdminLeaderRegion = "North West" | "Midlands" | "London & South East" | "Scotland";

export interface AdminLeader {
  id: string;
  fullName: string;
  initials: string;
  region: AdminLeaderRegion;
  specialty: string;
  email: string;
  bio: string;
  status: AdminLeaderStatus;
  membersAssigned: number;
  isTopMentor?: boolean;
}

export interface AdminLeadersStats {
  totalLeaders: number;
  membersCovered: number;
  topMentorCount: number;
  regionsCount: number;
}
