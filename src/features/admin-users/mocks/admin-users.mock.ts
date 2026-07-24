import type { ApiSuccess } from "@/types/api";
import type { AdminAccount, AdminUsersStats } from "@/features/admin-users/types";

export const adminUsersStatsMock: ApiSuccess<AdminUsersStats> = {
  success: true,
  message: "Admin users stats retrieved successfully",
  data: { superAdminsCount: 1, staffAccountsCount: 5, invitedNotActiveCount: 1, roleChangesCount: 3 },
};

export const adminAccountsMock: AdminAccount[] = [
  {
    id: "au_1",
    adminId: "PBT-A-0012",
    fullName: "Amaka Obi",
    initials: "AO",
    email: "amaka@propertybusinesstraining.com",
    role: "Super Admin",
    sections: [],
    status: "Active",
  },
  {
    id: "au_2",
    adminId: "PBT-S-0084",
    fullName: "Jenny Timms",
    initials: "JT",
    email: "jenny.t@propertybusinesstraining.com",
    role: "Content Manager",
    sections: ["content", "resources"],
    status: "Active",
  },
  {
    id: "au_3",
    adminId: "PBT-S-0091",
    fullName: "Daniel Koroma",
    initials: "DK",
    email: "daniel.koroma@propertybusinesstraining.com",
    role: "Community Moderator",
    sections: ["community", "events"],
    status: "Active",
  },
  {
    id: "au_4",
    adminId: "PBT-S-0102",
    fullName: "Funmi Lawal",
    initials: "FL",
    email: "funmi.lawal@propertybusinesstraining.com",
    role: "Support Staff",
    sections: ["members"],
    status: "Invited",
    accessNote: "(View Only)",
  },
  {
    id: "au_5",
    adminId: "PBT-S-0076",
    fullName: "Michael Bassey",
    initials: "MB",
    email: "michael.bassey@propertybusinesstraining.com",
    role: "Support Staff",
    sections: ["members"],
    status: "Active",
  },
  {
    id: "au_6",
    adminId: "PBT-S-0058",
    fullName: "Grace Adenuga",
    initials: "GA",
    email: "grace.adenuga@propertybusinesstraining.com",
    role: "Community Moderator",
    sections: ["community", "events"],
    status: "Active",
  },
];
