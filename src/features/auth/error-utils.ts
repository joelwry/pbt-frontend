import { AuthApiError } from "@/features/auth/repositories/auth.repository";

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
