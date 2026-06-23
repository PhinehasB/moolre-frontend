"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordValues } from "@/utils/validators";
import { FieldError, inputCls } from "@/utils/form";
import { useResetPassword, getApiError } from "@/hooks/use-auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="w-full max-w-sm">
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-4 mb-6">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">Invalid reset link</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              This password reset link is missing or has expired. Request a new one.
            </p>
          </div>
        </div>
        <Link
          href="/forgot-password"
          className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 text-center block"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
          <CheckCircle className="size-7 text-green-600" />
        </div>
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Password updated</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your password has been reset successfully. Sign in with your new password.
        </p>
        <Link
          href="/signin"
          className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 text-center block"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await resetPassword.mutateAsync({ token, newPassword: data.newPassword });
      setDone(true);
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const isPending = isSubmitting || resetPassword.isPending;

  return (
    <div className="w-full max-w-sm">
      <p className="text-green-600 text-xs font-semibold tracking-[0.16em] uppercase mb-2">
        Password reset
      </p>
      <h2 className="text-gray-900 text-3xl font-bold mb-1.5">Set a new password</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Use 8+ characters with letters, numbers, and a symbol.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-password" className="text-gray-700 text-sm font-medium">
            New password
          </label>
          <div className="relative">
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.newPassword}
              className={`${inputCls} pr-11`}
              {...register("newPassword")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError message={errors.newPassword?.message} />
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reset-confirm" className="text-gray-700 text-sm font-medium">
            Confirm password
          </label>
          <div className="relative">
            <Input
              id="reset-confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={!!errors.confirmPassword}
              className={`${inputCls} pr-11`}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <button
          id="reset-submit"
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:opacity-60 disabled:pointer-events-none"
        >
          {isPending ? "Updating…" : "Update password"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link href="/signin" className="font-semibold text-green-600 hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
