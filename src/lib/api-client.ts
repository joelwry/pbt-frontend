import axios from "axios";
import { getAccessToken } from "@/lib/access-token-store";

/**
 * Central Axios instance for the Express.js API.
 *
 * Every feature goes through a repository (see features/*\/repositories),
 * which is the only place that should import this client directly.
 */
// Access tokens are held in memory only — never localStorage/sessionStorage.
// Persistent ("remember me") sessions additionally rely on an httpOnly
// refresh cookie, which is why `withCredentials` is always on: it lets the
// browser attach that cookie automatically for members who opted in, while
// members who didn't simply have no cookie to send.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((requestConfig) => {
  const token = getAccessToken();
  if (token && !requestConfig.headers.Authorization) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});
