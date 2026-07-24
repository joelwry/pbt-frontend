import type { ApiSuccess } from "@/types/api";
import type { ContentManagerExtras } from "@/features/admin-staff-dashboard/types";

export const contentManagerExtrasMock: ApiSuccess<ContentManagerExtras> = {
  success: true,
  message: "Content Manager dashboard extras retrieved successfully",
  data: {
    unlocksThisWeek: 5,
    tasks: [
      {
        id: "task_1",
        title: "3 lessons scheduled to unlock this week — review before they go live",
        categoryLabel: "Content",
        icon: "calendar",
      },
      {
        id: "task_2",
        title: '1 resource awaiting final upload — "Q3 Deal Sourcing Toolkit"',
        categoryLabel: "Resources",
        icon: "upload",
      },
    ],
  },
};
