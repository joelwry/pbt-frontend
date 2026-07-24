export interface StaffTask {
  id: string;
  title: string;
  categoryLabel: string;
  icon: "calendar" | "upload";
}

export interface ContentManagerExtras {
  unlocksThisWeek: number;
  tasks: StaffTask[];
}
