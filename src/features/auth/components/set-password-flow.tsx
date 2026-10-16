"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Link2Off, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/shared/auth-shell";
import { Button } from "@/components/ui/button";
import { SetPasswordForm } from "@/features/auth/components/set-password-form";
import { authRepository } from "@/features/auth/repositories/auth.repository";

type Status = "checking" | "valid" | "invalid" | "done";

/**
 * The whole set-password / reset-password screen. On load it asks the backend
 * whether the emailed link is still usable, so an expired or already-used link
 * is reported straight away rather than after the member has typed a password.
 * Used by both /set-password (mode=setup) and /reset-password.
 */
export function SetPasswordFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const mode = searchParams.get("mode") === "setup" ? "setup" : "reset";

  const [status, setStatus] = useState<Status>(token ? "checking" : "invalid");
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    authRepository
      .validateResetToken(token)
      .then((result) => {
        if (cancelled) return;
        setMaskedEmail(result.email ?? null);
        setStatus(result.valid ? "valid" : "invalid");
      })
      .catch(() => {
        // Couldn't reach the check (network blip / server error). Don't block
        // a possibly-good link: show the form -- submitting still enforces
        // the real validation and will report a bad token if there is one.
        if (!cancelled) setStatus("valid");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === "checking") {
    return (
      <AuthShell icon={<ShieldCheck />} title="Checking your link" subtitle="One moment while we confirm it’s still valid.">
        <div className="space-y-4 animate-pulse" aria-busy="true">
          <div className="h-11 rounded-xl bg-border" />
          <div className="h-11 rounded-xl bg-border" />
          <div className="h-12 rounded-xl bg-border" />
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid") {
    return (
      <AuthShell
        icon={<Link2Off />}
        tone="warning"
        title="This link can’t be used"
        subtitle={token ? "It may have expired or already been used." : "This page needs the link from your email."}
      >
        <div className="space-y-5">
          <p className="text-sm text-text-secondary leading-relaxed text-center">
            {!token
              ? "Open the link in your email again, or request a new one below."
              : mode === "setup"
                ? "Account setup links can only be used once and expire after 24 hours. If you’ve already created your password, you can sign in now. Otherwise, request a new link and we’ll email it to you."
                : "Password reset links can only be used once and expire after 24 hours. Request a new link and we’ll email it to you."}
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/forgot-password">
              Request a new link
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="border-t border-border pt-5 text-center">
            <Link href="/login" className="text-sm font-semibold text-sky-600 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (status === "done") {
    return (
      <AuthShell
        icon={<CheckCircle2 />}
        tone="success"
        title={mode === "setup" ? "Your account is ready" : "Password updated"}
        subtitle={
          mode === "setup"
            ? "Your password is saved and your email is confirmed. Sign in to access your training, events and the PBT community."
            : "Your password has been changed. Sign in with your new password to continue."
        }
      >
        <Button asChild size="lg" className="w-full">
          <Link href="/login">
            Continue to Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      icon={<ShieldCheck />}
      title={mode === "setup" ? "Set up your account" : "Reset your password"}
      subtitle={
        maskedEmail
          ? `${mode === "setup" ? "Choose a password for" : "Choose a new password for"} ${maskedEmail}`
          : mode === "setup"
            ? "Choose a password to finish setting up your PBT membership login."
            : "Choose a new password for your account."
      }
    >
      <SetPasswordForm
        token={token!}
        mode={mode}
        onSuccess={() => setStatus("done")}
        onTokenRejected={() => setStatus("invalid")}
      />
    </AuthShell>
  );
}
