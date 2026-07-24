import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-chip)] px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        sky: "bg-sky-tint text-sky-600",
        orange: "bg-orange-tint text-orange-500",
        success: "bg-[#DCFCE7] text-[#15803D]",
        warning: "bg-[#FEF3C7] text-[#B45309]",
        error: "bg-[#FEE2E2] text-[#B91C1C]",
        slate: "bg-[#F1F5F9] text-slate-500",
        navy: "bg-navy-900 text-white",
        outline: "border border-border text-text-secondary bg-white",
      },
    },
    defaultVariants: {
      variant: "sky",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
