import { AdminAuthApiError } from "@/features/admin-auth/repositories/admin-auth.repository";

export function getAdminAuthErrorMessage(error: unknown): string {
  if (error instanceof AdminAuthApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
