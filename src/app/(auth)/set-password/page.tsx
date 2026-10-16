import type { Metadata } from "next";
import { Suspense } from "react";
import { SetPasswordFlow } from "@/features/auth/components/set-password-flow";
import { AuthShell } from "@/components/shared/auth-shell";

export const metadata: Metadata = {
  title: "Set Up Your Account | Property Business Training",
};

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<AuthShell title="Loading" ><div className="h-[260px]" /></AuthShell>}>
      <SetPasswordFlow />
    </Suspense>
  );
}
