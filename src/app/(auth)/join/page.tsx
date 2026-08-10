import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck, GraduationCap, Users2 } from "lucide-react";
import { JoinForm } from "@/features/join/components/join-form";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata: Metadata = {
  title: "Join PBT | Property Business Training",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:h-1 lg:w-full" />
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-linear-to-b from-navy-950 via-navy-900 to-sky-600 px-14 py-14">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-500 via-sky-500 to-navy-900" />

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
            JOIN PBT
          </span>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            Start your property business and legacy today.
          </h1>
          <p className="text-white/70 mt-5 leading-relaxed">
            Pick your membership and pay securely with Stripe. Your account is set up the moment payment
            completes -- check your email for a link to set your password.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-sm text-white/80">Structured learning, released on schedule</p>
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

      <div className="flex items-center justify-center px-6 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <h2 className="font-display text-3xl font-bold text-text-primary">Join PBT</h2>
          <p className="text-text-muted mt-2 mb-8">Choose your membership to get started.</p>

          <Suspense fallback={<div className="h-[520px]" />}>
            <JoinForm />
          </Suspense>

          <p className="text-sm text-text-muted text-center mt-6">
            Already a member?{" "}
            <Link href="/login" className="font-semibold text-sky-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
