import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { BrandMark } from "@/components/shared/brand-mark";

export const metadata: Metadata = {
  title: "Forgot Password | Property Business Training",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-14">
      <div className="flex items-center gap-3 mb-8">
        <BrandMark size={36} className="border border-border" />
        <p className="font-display text-sm font-bold text-text-primary leading-tight">
          Property Business
          <br />
          Training
        </p>
      </div>

      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-text-primary text-center">Forgot your password?</h1>
        <p className="text-text-muted text-sm text-center mt-2 mb-8">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
