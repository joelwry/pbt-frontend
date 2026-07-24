import type { AdminUser } from "@/features/admin-auth/types";

/**
 * Mock admin directory, standing in for the real admin_users table. Per
 * the login screen copy, admin accounts are provisioned manually by a
 * super-admin — there is no admin self-signup anywhere in this app.
 */
export interface MockAdminRecord {
  password: string;
  admin: AdminUser;
  accessTokenTtl: number;
  refreshTokenTtl: number;
}

export const MOCK_ADMIN_DIRECTORY: Record<string, MockAdminRecord> = {
  "amaka@propertybusinesstraining.com": {
    password: "password123",
    accessTokenTtl: 15 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    admin: {
      id: "admin_amaka",
      adminId: "PBT-A-0012",
      fullName: "Amaka Obi",
      initials: "AO",
      email: "amaka@propertybusinesstraining.com",
      role: "Super Admin",
      sections: [],
    },
  },
  "jenny.t@propertybusinesstraining.com": {
    password: "password123",
    accessTokenTtl: 15 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    admin: {
      id: "admin_jenny",
      adminId: "PBT-S-0084",
      fullName: "Jenny Timms",
      initials: "JT",
      email: "jenny.t@propertybusinesstraining.com",
      role: "Content Manager",
      sections: ["content", "resources"],
    },
  },
};
