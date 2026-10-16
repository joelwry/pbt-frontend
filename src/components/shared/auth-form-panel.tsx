import type { ReactNode } from "react";
import { BrandMark } from "@/components/shared/brand-mark";
import { cn } from "@/lib/utils";

interface AuthFormPanelProps {
  children: ReactNode;
  /** Tailwind max-width class for the card. */
  maxWidth?: string;
}

/**
 * The form side of the split sign-in / join / admin-login screens. Wraps the
 * form in an elevated white card (instead of bare text on the page
 * background). The left hero panel is untouched. Below the `lg` breakpoint the
 * hero is hidden, so a compact brand header is shown above the card instead.
 */
export function AuthFormPanel({ children, maxWidth = "max-w-md" }: AuthFormPanelProps) {
  return (
    <div className="relative flex flex-col items-center justify-center bg-background px-4 py-10 sm:px-8 lg:px-10 lg:py-14">
      <div className="flex items-center gap-3 mb-6 lg:hidden">
        <BrandMark size={40} className="border border-border" />
        <p className="font-display text-sm font-bold text-text-primary leading-tight">
          Property Business
          <br />
          Training
        </p>
      </div>

      {/* box-shadow is inline: .pbt-card is unlayered CSS and would override a Tailwind shadow utility. */}
      <div
        className={cn("pbt-card w-full px-6 py-8 sm:px-10 sm:py-10", maxWidth)}
        style={{ boxShadow: "0 18px 60px rgba(13, 10, 48, 0.10)" }}
      >
        {children}
      </div>
    </div>
  );
}
