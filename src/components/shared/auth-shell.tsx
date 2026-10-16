import type { ReactNode } from "react";
import { BrandMark } from "@/components/shared/brand-mark";

type AuthShellTone = "default" | "warning" | "success";

const ICON_TONES: Record<AuthShellTone, string> = {
  default: "bg-sky-tint text-sky-600",
  warning: "bg-orange-tint text-orange-500",
  success: "bg-[#DCFCE7] text-[#15803D]",
};

interface AuthShellProps {
  /** Colour of the icon badge. */
  tone?: AuthShellTone;
  /** Optional icon (e.g. a lucide icon element) shown in a badge above the title. */
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Shared frame for the standalone auth pages (set password, reset password,
 * forgot password). A navy/sky brand band across the top (same palette as the
 * sign-in hero), with the form sitting in an elevated white card overlapping
 * it -- instead of bare text on the page background.
 */
export function AuthShell({ icon, tone = "default", title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-navy-950 via-navy-900 to-sky-600" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-orange-500 via-sky-500 to-navy-900"
        aria-hidden
      />
      <div className="absolute right-0 top-0 flex items-end gap-2 opacity-10" aria-hidden>
        {[40, 64, 52, 80, 60, 48, 72].map((h, i) => (
          <div key={i} className="w-8 bg-orange-500 rounded-b-sm" style={{ height: h * 1.4 }} />
        ))}
      </div>

      <div className="relative flex flex-col items-center px-4 pt-12 pb-14 sm:px-6">
        <div className="flex items-center gap-3">
          <BrandMark size={44} />
          <p className="font-display text-base font-bold text-white leading-tight">
            Property Business
            <br />
            Training
          </p>
        </div>

        {/* box-shadow is set inline: .pbt-card is unlayered CSS and would override a Tailwind shadow utility. */}
        <div
          className="pbt-card w-full max-w-md mt-8 px-6 py-8 sm:px-10 sm:py-10"
          style={{ boxShadow: "0 18px 60px rgba(13, 10, 48, 0.18)" }}
        >
          {icon && (
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-5 [&_svg]:h-6 [&_svg]:w-6 ${ICON_TONES[tone]}`}
            >
              {icon}
            </div>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary text-center">{title}</h1>
          {subtitle && <p className="text-text-muted text-sm sm:text-base text-center mt-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>

        <p className="text-xs text-text-muted mt-6 text-center">
          Need help? Contact{" "}
          <span className="font-semibold text-text-secondary">support@propertybusinesstraining.com</span>
        </p>
      </div>
    </div>
  );
}
