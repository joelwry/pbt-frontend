import axios from "axios";
import { getAdminAccessToken } from "@/lib/admin-access-token-store";

/**
 * Separate Axios instance for admin-portal calls — same backend, but its own
 * token attachment so an admin session never shares state with the member
 * apiClient (see admin-access-token-store.ts). Every admin feature repository
 * should import this instead of the member `apiClient`.
 */
export const adminApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminApiClient.interceptors.request.use((requestConfig) => {
  const token = getAdminAccessToken();
  if (token && !requestConfig.headers.Authorization) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});
