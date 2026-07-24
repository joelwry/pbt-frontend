import axios from "axios";

/**
 * Central Axios instance for the future Express.js API.
 *
 * Nothing in the app talks to this directly today — every feature goes
 * through a repository (see features/*\/repositories). While repositories
 * return mock data, swapping a repository's implementation to call this
 * client is the only change required to go live.
 */
// Auth is cookie-based (httpOnly refresh + short-lived access token) once the
// real API is live, per SECURITY.md — no tokens are ever kept in
// localStorage/sessionStorage. `withCredentials` lets the browser attach
// those cookies automatically.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
