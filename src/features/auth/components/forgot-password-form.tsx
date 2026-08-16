"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authRepository, AuthApiError } from "@/features/auth/repositories/auth.repository";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  if (sent) {
    return (
      <div className="text-center py-6">
        <MailCheck className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="font-display text-xl font-bold text-text-primary">Check your email</h3>
        <p className="text-text-muted mt-2 mb-6">
          If an account exists for that email, we&apos;ve sent a link to reset your password. It can take a
          minute or two to arrive.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">
            Back to Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(values: ForgotPasswordValues) {
    setFormError(null);
    setIsPending(true);
    try {
      await authRepository.requestPasswordReset(values.email);
      setSent(true);
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
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Reset Link
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
