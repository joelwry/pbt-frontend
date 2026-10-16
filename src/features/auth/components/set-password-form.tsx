"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowRight, Loader2, Eye, EyeOff, Check, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authRepository, AuthApiError } from "@/features/auth/repositories/auth.repository";
import { cn } from "@/lib/utils";

// Mirrors PASSWORD_MIN_LENGTH in the backend (core/security/passwordPolicy.ts).
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

/** Advisory strength rules -- only the 8-character minimum is enforced; the rest guide a stronger choice. */
function evaluatePassword(password: string) {
  const rules = [
    { id: "length", label: "At least 8 characters", met: password.length >= 8, required: true },
    { id: "case", label: "Upper and lower case letters", met: /[a-z]/.test(password) && /[A-Z]/.test(password), required: false },
    { id: "number", label: "A number or symbol", met: /[\d\W_]/.test(password), required: false },
  ];
  const score = password.length === 0 ? 0 : rules.filter((r) => r.met).length + (password.length >= 12 ? 1 : 0);
  const level = score <= 1 ? { label: "Weak", bar: "bg-error", text: "text-error" }
    : score === 2 ? { label: "Fair", bar: "bg-warning", text: "text-[#B45309]" }
    : score === 3 ? { label: "Good", bar: "bg-sky-500", text: "text-sky-600" }
    : { label: "Strong", bar: "bg-success", text: "text-[#15803D]" };
  return { rules, score: Math.min(score, 4), level };
}

interface SetPasswordFormProps {
  token: string;
  mode: "setup" | "reset";
  onSuccess: () => void;
  /** The backend rejected the token on submit (used in another tab / expired meanwhile). */
  onTokenRejected: () => void;
}

export function SetPasswordForm({ token, mode, onSuccess, onTokenRejected }: SetPasswordFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetPasswordValues>({ resolver: zodResolver(setPasswordSchema), defaultValues: { password: "", confirmPassword: "" } });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const strength = evaluatePassword(password);
  const matches = confirmPassword.length > 0 && password === confirmPassword;

  async function onSubmit(values: SetPasswordValues) {
    setFormError(null);
    setIsPending(true);
    try {
      await authRepository.setNewPassword(token, values.password);
      onSuccess();
    } catch (error) {
      if (error instanceof AuthApiError && /invalid or expired/i.test(error.message)) {
        onTokenRejected();
        return;
      }
      setFormError(error instanceof AuthApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {formError && (
        <div role="alert" className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">{mode === "setup" ? "Create a password" : "New password"}</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a password"
            autoComplete="new-password"
            invalid={!!errors.password}
            className="pl-10 pr-11"
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

        {password.length > 0 && (
          <div className="pt-1" aria-live="polite">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 gap-1.5" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= strength.score ? strength.level.bar : "bg-border")}
                  />
                ))}
              </div>
              <span className={cn("text-xs font-semibold w-12 text-right", strength.level.text)}>{strength.level.label}</span>
            </div>
          </div>
        )}

        <ul className="rounded-xl bg-background border border-border px-4 py-3 space-y-1.5 mt-1">
          {strength.rules.map((rule) => (
            <li key={rule.id} className={cn("flex items-center gap-2 text-xs", rule.met ? "text-[#15803D]" : "text-text-muted")}>
              <span
                className={cn(
                  "h-4 w-4 rounded-full flex items-center justify-center shrink-0",
                  rule.met ? "bg-[#DCFCE7]" : "bg-border"
                )}
              >
                {rule.met && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              {rule.label}
              {!rule.required && <span className="text-text-muted/70">(recommended)</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            className={cn("pl-10", matches && "pr-10")}
            {...register("confirmPassword")}
          />
          {matches && <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-success" strokeWidth={3} />}
        </div>
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
            {mode === "setup" ? "Create account" : "Update password"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="border-t border-border pt-5 text-center">
        <Link href="/login" className="text-sm font-semibold text-sky-600 hover:underline">
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}
