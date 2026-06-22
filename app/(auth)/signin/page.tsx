"use client";

import { Input } from "@/components/ui/input";
import { FieldError, inputCls } from "@/utils/form";
import { signInSchema, type SignInValues } from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", keepSigned: false },
  });

  const onSubmit = (data: SignInValues) => {
    // TODO: wire up auth
    redirect("/dashboard");
  };

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <p className="text-primary-600 text-xs font-semibold tracking-[0.16em] uppercase mb-2">
        Business Dashboard
      </p>
      <h2 className="text-gray-900 text-3xl font-bold mb-1.5">Welcome back</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Sign in to manage payroll, your team, and your Moolre wallet.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signin-email"
            className="text-gray-700 text-sm font-medium"
          >
            Work email
          </label>
          <Input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            className={inputCls}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signin-password"
            className="text-gray-700 text-sm font-medium"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              className={`${inputCls} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        {/* Keep signed in + Forgot */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="signin-keep"
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              id="signin-keep"
              type="checkbox"
              className="size-4 rounded border-gray-300 accent-green-600 cursor-pointer"
              {...register("keepSigned")}
            />
            <span className="text-sm text-gray-600">Keep me signed in</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-green-600 hover:underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          id="signin-submit"
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:opacity-60 disabled:pointer-events-none"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-gray-500">
        New to Klare?{" "}
        <Link
          href="/signup"
          className="font-semibold text-green-600 hover:underline underline-offset-2"
        >
          Create a company account
        </Link>
      </p>
    </div>
  );
}
