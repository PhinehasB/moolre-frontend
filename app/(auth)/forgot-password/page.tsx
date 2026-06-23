"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/utils/validators";
import { FieldError, inputCls } from "@/utils/form";
import { useForgotPassword, getApiError } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await forgotPassword.mutateAsync({ email: data.email });
      setSent(true);
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const isPending = isSubmitting || forgotPassword.isPending;

  if (sent) {
    return (
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
          <Mail className="size-7 text-green-600" />
        </div>

        <h2 className="text-gray-900 text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-1">
          If an account exists for
        </p>
        <p className="text-gray-900 text-sm font-semibold mb-4">
          {getValues("email")}
        </p>
        <p className="text-gray-400 text-xs leading-relaxed mb-8 max-w-xs">
          we&apos;ve sent a password reset link. The link expires in 30 minutes.
        </p>

        <Link
          href="/signin"
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.985] transition-all duration-150 text-center block"
        >
          Back to sign in
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          Didn&apos;t receive it?{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-semibold text-green-600 hover:underline underline-offset-2"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/signin"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8 group w-fit"
      >
        <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to sign in
      </Link>

      <p className="text-green-600 text-xs font-semibold tracking-[0.16em] uppercase mb-2">
        Password reset
      </p>
      <h2 className="text-gray-900 text-3xl font-bold mb-1.5">Forgot your password?</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Enter the email you used when signing up and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="forgot-email" className="text-gray-700 text-sm font-medium">
            Work email
          </label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            className={inputCls}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <button
          id="forgot-submit"
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:opacity-60 disabled:pointer-events-none"
        >
          {isPending ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
