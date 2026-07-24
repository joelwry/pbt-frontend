export interface DashboardStats {
  lessonsCompleted: number;
  lessonsCompletedDeltaLabel: string;
  studyHours: number;
  studyHoursDeltaLabel: string;
  contentUnlocked: number;
  contentUnlockedTotal: number;
  nextUnlockInDays: number;
  nextUnlockLabel: string;
}

export interface ProgrammeProgress {
  overallPercent: number;
  encouragement: string;
  completed: number;
  unlockedInProgress: number;
  upcoming: number;
  totalThisYear: number;
  programmeLabel: string;
}

export type LessonType = "Video" | "Article" | "Download" | "Quiz";

export interface ContinueLearningLesson {
  id: string;
  category: string;
  title: string;
  type: LessonType;
  unlockedLabel: string;
  availabilityLabel: string;
  progressPercent: number;
  timeLeftLabel: string;
}

export interface QuickAccessTile {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "learning" | "resources" | "community" | "events";
}

export interface UpcomingEvent {
  id: string;
  day: string;
  month: string;
  title: string;
  timeLabel: string;
  format: "Live Online" | "In-Person" | "Workshop";
}

export interface CommunityActivityItem {
  id: string;
  authorName: string;
  message: string;
  timeAgoLabel: string;
  kind: "post" | "announcement" | "reply";
}

export interface DashboardData {
  memberFirstName: string;
  stats: DashboardStats;
  programmeProgress: ProgrammeProgress;
  continueLearning: ContinueLearningLesson | null;
  quickAccess: QuickAccessTile[];
  upcomingEvents: UpcomingEvent[];
  communityActivity: CommunityActivityItem[];
}
