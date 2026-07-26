import axios from "axios";
import type { ApiError } from "@/types/api";

/** Extracts a human-readable message from a failed apiClient call — shared across features that don't have their own dedicated error type (see features/auth/error-utils.ts for that pattern). */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const payload = error.response.data as Partial<ApiError>;
    return payload.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
