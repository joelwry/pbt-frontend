import type { ApiSuccess } from "@/types/api";

/** Billing details not already carried on the member record (payment method on file, etc). No real payment gateway exists yet (Stripe integration is deferred), so this stays a static placeholder. */
export interface BillingDetails {
  paymentMethodLabel: string;
}

export const billingDetailsMock: ApiSuccess<BillingDetails> = {
  success: true,
  message: "Billing details retrieved successfully",
  data: { paymentMethodLabel: "Visa •••• 4471" },
};
