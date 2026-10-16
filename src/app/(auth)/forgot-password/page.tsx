import type { Metadata } from "next";
import { MailQuestion } from "lucide-react";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthShell } from "@/components/shared/auth-shell";

export const metadata: Metadata = {
  title: "Forgot Password | Property Business Training",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell icon={<MailQuestion />} title="Forgot your password?" subtitle="Enter your email and we'll send you a link to reset it.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
