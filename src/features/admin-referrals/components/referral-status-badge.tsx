import { Badge } from "@/components/ui/badge";
import type { ReferralStatus } from "@/features/admin-referrals/types";

const VARIANT_BY_STATUS: Record<ReferralStatus, "slate" | "warning" | "sky" | "success"> = {
  REFERRED: "slate",
  CUSTOMER_SIGNED_UP: "slate",
  AWAITING_FIRST_PAYMENT: "warning",
  FIRST_PAYMENT_RECEIVED: "sky",
  REWARD_EARNED: "sky",
  PAYMENT_PENDING: "warning",
  PAID: "success",
};

export function ReferralStatusBadge({ status, label }: { status: ReferralStatus; label: string }) {
  return <Badge variant={VARIANT_BY_STATUS[status]}>{label}</Badge>;
}
