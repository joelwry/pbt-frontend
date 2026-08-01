import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiError } from "@/types/api";
import type { JoinFormValues } from "@/features/join/join-schema";

export interface CheckoutSessionResult {
  checkoutUrl: string;
}

/** Surfaces the backend's real message (e.g. "An account with this email already exists") instead of a generic failure. */
export function getJoinErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const payload = error.response.data as Partial<ApiError>;
    return payload.message ?? "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export const joinRepository = {
  /** Public endpoint -- no auth token exists yet, this call is what creates one (via the Stripe webhook, once payment completes). */
  async createSignupCheckout(values: JoinFormValues, referralCode?: string): Promise<ApiSuccess<CheckoutSessionResult>> {
    const { data } = await apiClient.post<ApiSuccess<CheckoutSessionResult>>("/billing/signup-checkout", {
      ...values,
      referralCode,
    });
    return data;
  },
};
