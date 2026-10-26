import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // `active:translate-y-px` gives every button a physical press. The focus
  // ring is inherited from the global :focus-visible rule in globals.css
  // rather than redeclared per variant, so it can't drift out of step.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-btn)] text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none",
  {
    variants: {
      variant: {
        // Subtle top-light gradient plus a glow in the button's own hue --
        // a flat fill with a grey shadow was the single most dated element
        // on the page.
        primary:
          "bg-linear-to-b from-sky-500 to-sky-600 text-white shadow-[var(--pbt-glow-sky)] hover:brightness-[1.06] hover:shadow-[0_4px_10px_rgba(38,170,225,0.28),0_12px_32px_rgba(38,170,225,0.26)] active:brightness-95",
        secondary:
          "bg-surface text-text-primary shadow-[var(--pbt-elev-xs)] hover:bg-surface-muted hover:shadow-[var(--pbt-elev-sm)]",
        ghost: "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
        danger:
          "bg-linear-to-b from-[#f05252] to-error text-white shadow-[0_2px_6px_rgba(239,68,68,0.24),0_8px_24px_rgba(239,68,68,0.2)] hover:brightness-[1.06]",
        premium:
          "bg-linear-to-b from-navy-900 to-navy-950 text-orange-500 shadow-[var(--pbt-elev-md)] hover:brightness-110",
        link: "text-sky-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
