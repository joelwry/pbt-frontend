import type { Metadata } from "next";
import { Suspense } from "react";
import { SetPasswordForm } from "@/features/auth/components/set-password-form";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata: Metadata = {
  title: "Set Up Your Account | Property Business Training",
};

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-14 sm:px-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <BrandMark size={40} />
          <p className="font-display text-sm font-bold text-text-primary leading-tight">
            Property Business
            <br />
            Training
          </p>
        </div>

        <h2 className="font-display text-3xl font-bold text-text-primary">Set up your account</h2>
        <p className="text-text-muted mt-2 mb-8">Choose a password to finish setting up your PBT membership login.</p>

        <Suspense fallback={<div className="h-[336px]" />}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
