import type { CurrentMember } from "@/features/session/types";

/**
 * Mock member directory + credentials, standing in for the real members table
 * the Express API will query against. Passwords are plaintext here ONLY
 * because this is a frontend mock with no server — the real backend must
 * hash with bcrypt per SECURITY.md and never expose this shape.
 *
 * Token lifetimes are deliberately varied per persona so every session
 * behaviour (silent refresh, forced logout, expired subscription, tier
 * gating) can be exercised without waiting hours for a real token to expire.
 */
export interface MockUserRecord {
  password: string;
  member: CurrentMember;
  /** Access token lifetime, in seconds. */
  accessTokenTtl: number;
  /** Refresh token lifetime, in seconds. */
  refreshTokenTtl: number;
}

export const MOCK_USER_DIRECTORY: Record<string, MockUserRecord> = {
  "kudirat@olowosaleproperty.co.uk": {
    password: "password123",
    accessTokenTtl: 15 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    member: {
      id: "mem_01H8X9",
      clientId: "PBT-04231",
      fullName: "Kudirat Olowosale",
      initials: "KO",
      email: "kudirat@olowosaleproperty.co.uk",
      membershipTier: "Mentorship",
      subscriptionStatus: "active",
      subscriptionDate: "2026-09-01",
    },
  },
  "alice.pathway@pbt.test": {
    password: "password123",
    accessTokenTtl: 15 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    member: {
      id: "mem_alice",
      clientId: "PBT-01120",
      fullName: "Alice Whitmore",
      initials: "AW",
      email: "alice.pathway@pbt.test",
      membershipTier: "Pathway",
      subscriptionStatus: "active",
      subscriptionDate: "2026-08-14",
    },
  },
  "ben.plus@pbt.test": {
    password: "password123",
    accessTokenTtl: 15 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    member: {
      id: "mem_ben",
      clientId: "PBT-02245",
      fullName: "Ben Okoye",
      initials: "BO",
      email: "ben.plus@pbt.test",
      membershipTier: "Plus",
      subscriptionStatus: "active",
      subscriptionDate: "2026-07-30",
    },
  },
  "carla.expired@pbt.test": {
    password: "password123",
    accessTokenTtl: 15 * 60,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    member: {
      id: "mem_carla",
      clientId: "PBT-03310",
      fullName: "Carla Jennings",
      initials: "CJ",
      email: "carla.expired@pbt.test",
      membershipTier: "Pathway",
      subscriptionStatus: "expired",
      subscriptionDate: "2026-06-18",
    },
  },
  "derek.silentrefresh@pbt.test": {
    password: "password123",
    // Access token expires in 20s but the refresh token is long-lived —
    // watch the network tab: it should silently refresh with no redirect.
    accessTokenTtl: 20,
    refreshTokenTtl: 7 * 24 * 60 * 60,
    member: {
      id: "mem_derek",
      clientId: "PBT-04456",
      fullName: "Derek Adjei",
      initials: "DA",
      email: "derek.silentrefresh@pbt.test",
      membershipTier: "Plus",
      subscriptionStatus: "active",
      subscriptionDate: "2026-08-02",
    },
  },
  "erin.forcedlogout@pbt.test": {
    password: "password123",
    // Both tokens expire almost immediately — the refresh attempt itself
    // will fail, forcing a logout + redirect back to /login.
    accessTokenTtl: 20,
    refreshTokenTtl: 25,
    member: {
      id: "mem_erin",
      clientId: "PBT-05567",
      fullName: "Erin Slater",
      initials: "ES",
      email: "erin.forcedlogout@pbt.test",
      membershipTier: "Pathway",
      subscriptionStatus: "active",
      subscriptionDate: "2026-08-20",
    },
  },
};
