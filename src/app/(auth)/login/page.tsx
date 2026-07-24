import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle2, ShieldCheck, Building2, Users2 } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { DemoAccountsPanel } from "@/features/auth/components/demo-accounts-panel";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata: Metadata = {
  title: "Sign In | Property Business Training",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:h-1 lg:w-full" />
      {/* Hero */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-sky-600 px-14 py-14">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-sky-500 to-navy-900" />
        <div className="absolute right-0 bottom-0 flex items-end gap-2 opacity-20" aria-hidden>
          {[40, 64, 52, 80, 60, 48, 72].map((h, i) => (
            <div key={i} className="w-10 bg-orange-500 rounded-t-sm" style={{ height: h * 2 }} />
          ))}
        </div>

        <div className="relative flex items-center gap-3">
          <BrandMark size={44} />
          <p className="font-display text-base font-bold text-white leading-tight">
            Property Business
            <br />
            Training
          </p>
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-500 mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            CLIENT-ONLY PORTAL
          </span>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            Your property business and legacy, organised in one place.
          </h1>
          <p className="text-white/70 mt-5 leading-relaxed">
            Structured learning, live events, your PBT community and Power Team — all in a
            portal built for members already on the PBT Pathway, Plus or Mentorship
            programme.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-sm text-white/80">New content unlocked on a structured schedule</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Users2 className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-sm text-white/80">A community and Power Team ready to support you</p>
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-6 py-14 sm:px-10">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl font-bold text-text-primary">Welcome back</h2>
          <p className="text-text-muted mt-2 mb-8">Sign in to continue your property journey.</p>

          <Suspense fallback={<div className="h-[336px]" />}>
            <LoginForm />
          </Suspense>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                Need Help?
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-sky-tint px-4 py-4 flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-primary">New to PBT?</p>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                Membership access is set up after you subscribe on our main site. Check
                your welcome email for your Client ID and login details, or contact{" "}
                <span className="font-semibold text-text-primary">
                  support@propertybusinesstraining.com
                </span>
                .
              </p>
            </div>
          </div>

          <div className="mt-4">
            <DemoAccountsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
