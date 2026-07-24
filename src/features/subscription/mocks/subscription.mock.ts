import type { ApiSuccess } from "@/types/api";
import type { Invoice } from "@/features/subscription/types";

/** Billing details not already carried on the member record (payment method on file, etc). */
export interface BillingDetails {
  paymentMethodLabel: string;
}

export const billingDetailsMock: ApiSuccess<BillingDetails> = {
  success: true,
  message: "Billing details retrieved successfully",
  data: { paymentMethodLabel: "Visa •••• 4471" },
};

export const invoicesMock: Invoice[] = [
  { id: "inv_1", invoiceNumber: "INV-2026-0602", dateLabel: "1 Jun 2026", amountLabel: "£149.00", status: "Paid" },
  { id: "inv_2", invoiceNumber: "INV-2026-0502", dateLabel: "1 May 2026", amountLabel: "£149.00", status: "Paid" },
  { id: "inv_3", invoiceNumber: "INV-2026-0402", dateLabel: "1 Apr 2026", amountLabel: "£149.00", status: "Paid" },
  { id: "inv_4", invoiceNumber: "INV-2026-0302", dateLabel: "1 Mar 2026", amountLabel: "£149.00", status: "Paid" },
  { id: "inv_5", invoiceNumber: "INV-2026-0202", dateLabel: "1 Feb 2026", amountLabel: "£149.00", status: "Paid" },
  { id: "inv_6", invoiceNumber: "INV-2026-0102", dateLabel: "1 Jan 2026", amountLabel: "£79.00", status: "Paid" },
  { id: "inv_7", invoiceNumber: "INV-2025-1202", dateLabel: "1 Dec 2025", amountLabel: "£79.00", status: "Paid" },
  { id: "inv_8", invoiceNumber: "INV-2025-1102", dateLabel: "1 Nov 2025", amountLabel: "£79.00", status: "Paid" },
];
