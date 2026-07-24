"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminAuth } from "@/providers/admin-auth-provider";
import { useToast } from "@/providers/toast-provider";
import { getAdminAuthErrorMessage } from "@/features/admin-auth/error-utils";
import { useState } from "react";

const adminLoginSchema = z.object({
  email: z.string().min(1, "Admin email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberDevice: z.boolean(),
});
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAdminAuth();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "", rememberDevice: false },
  });

  async function onSubmit(values: AdminLoginFormValues) {
    setFormError(null);
    setIsPending(true);
    try {
      const admin = await login(values);
      toast({ variant: "success", title: `Welcome back, ${admin.fullName.split(" ")[0]}!` });
      const returnTo = searchParams.get("returnTo");
      router.push(returnTo && returnTo.startsWith("/admin") ? returnTo : "/admin/dashboard");
    } catch (error) {
      setFormError(getAdminAuthErrorMessage(error));
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
        <Label htmlFor="email">Admin Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@propertybusinesstraining.com"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••••"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Controller
            control={control}
            name="rememberDevice"
            render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
          />
          <span className="text-sm text-text-secondary">Remember this device</span>
        </label>
        <Button variant="link" type="button" className="text-sm">
          Forgot password?
        </Button>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
