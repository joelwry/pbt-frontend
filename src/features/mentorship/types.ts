export interface MentorshipBenefit {
  id: string;
  title: string;
  description: string;
}

export interface AssignedMentor {
  name: string;
  initials: string;
  regionLabel: string;
  badgeLabel: string;
}

export type CallStatus = "Confirmed" | "Scheduled" | "Cancelled";

export interface MentorshipCall {
  id: string;
  dateLabel: string;
  topic: string;
  mentorName: string;
  status: CallStatus;
}

export interface MentorshipPageData {
  tagline: string;
  headline: string;
  description: string;
  renewsLabel: string;
  benefits: MentorshipBenefit[];
  assignedMentor: AssignedMentor;
}
