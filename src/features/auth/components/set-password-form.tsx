"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authRepository, AuthApiError } from "@/features/auth/repositories/auth.repository";

const setPasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type SetPasswordValues = z.infer<typeof setPasswordSchema>;

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const mode = searchParams.get("mode") === "setup" ? "setup" : "reset";

  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordValues>({ resolver: zodResolver(setPasswordSchema) });

  if (!token) {
    return (
      <div role="alert" className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-text-primary">Missing or invalid link</p>
          <p className="text-sm text-text-secondary mt-1">
            This page needs a valid setup link from your email. Request a new one or contact{" "}
            <span className="font-semibold text-text-primary">support@propertybusinesstraining.com</span>.
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-text-primary">
          {mode === "setup" ? "Your account is ready" : "Password updated"}
        </h3>
        <p className="text-text-muted mt-2 mb-6">You can now sign in with your new password.</p>
        <Button className="w-full" onClick={() => router.push("/login")}>
          Go to Sign In
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  async function onSubmit(values: SetPasswordValues) {
    setFormError(null);
    setIsPending(true);
    try {
      await authRepository.setNewPassword(token!, values.password);
      setDone(true);
    } catch (error) {
      setFormError(error instanceof AuthApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {formError && (
        <div role="alert" className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">{mode === "setup" ? "Create a Password" : "New Password"}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••"
            autoComplete="new-password"
            invalid={!!errors.password}
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••••"
          autoComplete="new-password"
          invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            {mode === "setup" ? "Set Up Account" : "Reset Password"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-text-muted">
        <Link href="/login" className="font-semibold text-sky-600 hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}
