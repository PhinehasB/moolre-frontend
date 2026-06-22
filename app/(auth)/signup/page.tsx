"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldError, inputCls } from "@/utils/form";
import { INDUSTRIES } from "@/utils/mock";
import {
  adminSchema,
  companySchema,
  type AdminValues,
  type CompanyValues,
} from "@/utils/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

// industry dropdown
function IndustrySelect({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-invalid={hasError}
        className={`
          w-full min-w-0 h-auto rounded-lg border bg-white
          px-4 py-2.5 text-sm text-gray-900
          data-placeholder:text-gray-400
          outline-none transition-colors
          data-[size=default]:h-auto
          ${
            hasError
              ? "border-red-400 focus:border-red-500 ring-2 ring-red-400/15"
              : "border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-600/15"
          }
        `}
      >
        <SelectValue placeholder="Select…" />
      </SelectTrigger>
      <SelectContent>
        {INDUSTRIES.map((_idx) => (
          <SelectItem key={_idx} value={_idx}>
            {_idx}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Progress bar
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            i < current ? "bg-green-600" : "bg-gray-200"
          }`}
        /> 
      ))}
    </div>
  );
}

// Step 1: Company
function StepCompany({ onNext }: { onNext: (data: CompanyValues) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { companyName: "", registrationNo: "", industry: "" },
  });

  const industry = watch("industry");

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      noValidate
      className="w-full max-w-sm"
    >
      <StepProgress current={1} total={3} />

      <p className="text-green-600 text-xs font-semibold tracking-[0.16em] uppercase mb-2">
        Step 1 of 3 &bull; Company
      </p>
      <h2 className="text-gray-900 text-3xl font-bold mb-1.5">
        Create your company
      </h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Sign in to manage payroll, your team, and your Moolre wallet.
      </p>

      {/* Company name */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label
          htmlFor="company-name"
          className="text-gray-700 text-sm font-medium"
        >
          Company name
        </label>
        <Input
          id="company-name"
          type="text"
          placeholder="TechCorp Ltd"
          aria-invalid={!!errors.companyName}
          className={inputCls}
          {...register("companyName")}
        />
        <FieldError message={errors.companyName?.message} />
      </div>

      {/* Registration + Industry */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-no" className="text-gray-700 text-sm font-medium">
            Registration no.
          </label>
          <Input
            id="reg-no"
            type="text"
            placeholder="CS-000-000"
            aria-invalid={!!errors.registrationNo}
            className={inputCls}
            {...register("registrationNo")}
          />
          <FieldError message={errors.registrationNo?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-700 text-sm font-medium">Industry</label>
          <IndustrySelect
            value={industry ?? ""}
            onChange={(val) =>
              setValue("industry", val, { shouldValidate: true })
            }
            hasError={!!errors.industry}
          />
          <FieldError message={errors.industry?.message} />
        </div>
      </div>

      <button
        id="signup-step1-continue"
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:opacity-60 disabled:pointer-events-none"
      >
        Continue
      </button>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-green-600 hover:underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

// Step 2: Administrator
function StepAdmin({
  onNext,
  onBack,
}: {
  onNext: (data: AdminValues) => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      noValidate
      className="w-full max-w-sm"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5 group"
      >
        <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <StepProgress current={2} total={3} />

      <p className="text-green-600 text-xs font-semibold tracking-[0.16em] uppercase mb-2">
        Step 2 of 3 &middot; Administrator
      </p>
      <h2 className="text-gray-900 text-3xl font-bold mb-1.5">
        Your admin login
      </h2>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        This is the account you&apos;ll use to run payroll.
      </p>

      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="first-name"
            className="text-gray-700 text-sm font-medium"
          >
            First name
          </label>
          <Input
            id="first-name"
            type="text"
            placeholder="Ama"
            aria-invalid={!!errors.firstName}
            className={inputCls}
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="last-name"
            className="text-gray-700 text-sm font-medium"
          >
            Last name
          </label>
          <Input
            id="last-name"
            type="text"
            placeholder="Owusu"
            aria-invalid={!!errors.lastName}
            className={inputCls}
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label
          htmlFor="admin-email"
          className="text-gray-700 text-sm font-medium"
        >
          Work email
        </label>
        <Input
          id="admin-email"
          type="email"
          placeholder="ama@techcorp.com"
          aria-invalid={!!errors.email}
          className={inputCls}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label
          htmlFor="admin-phone"
          className="text-gray-700 text-sm font-medium"
        >
          Phone number
        </label>
        <Input
          id="admin-phone"
          type="tel"
          placeholder="+233 05 485 7203"
          aria-invalid={!!errors.phone}
          className={inputCls}
          {...register("phone")}
        />
        <FieldError message={errors.phone?.message} />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 mb-1.5">
        <label
          htmlFor="admin-password"
          className="text-gray-700 text-sm font-medium"
        >
          Create password
        </label>
        <div className="relative">
          <Input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
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
      <p className="text-xs text-gray-400 mb-6">
        Use 8+ characters with a mix of letters, numbers &amp; symbols.
      </p>

      <button
        id="signup-step2-continue"
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:opacity-60 disabled:pointer-events-none"
      >
        Continue
      </button>
    </form>
  );
}

// Step 3: Confirm
function StepConfirm({
  companyName,
  onSubmit,
  onBack,
}: {
  companyName: string;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPayment, setAgreedPayment] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="w-full max-w-sm"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5 group"
      >
        <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <StepProgress current={3} total={3} />

      <p className="text-green-600 text-xs font-semibold tracking-[0.16em] uppercase mb-2">
        Step 3 of 3 &mdash; Confirm
      </p>
      <h2 className="text-gray-900 text-3xl font-bold mb-1.5">Almost there</h2>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Review and agree, then we&apos;ll create your wallet.
      </p>

      {/* Info callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <span className="mt-0.5 shrink-0 text-amber-600">
          <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <p className="text-xs text-amber-800 leading-relaxed">
          When you finish, Klare creates a{" "}
          <span className="font-semibold">Moolre business wallet</span> for{" "}
          <span className="font-semibold">{companyName || "your company"}</span>
          . You&apos;ll fund this wallet, and every payday it just prompts you
          and based on that you can either pay them manually or automated (have
          a settings to switch in on).
        </p>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-4 mb-6">
        <label
          htmlFor="agree-terms"
          className="flex items-start gap-3 cursor-pointer"
        >
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 size-4 rounded border-gray-300 accent-green-600 cursor-pointer shrink-0"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I agree to Klare&apos;s{" "}
            <Link
              href="#"
              className="text-green-600 underline underline-offset-2"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-green-600 underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <label
          htmlFor="agree-payment"
          className="flex items-start gap-3 cursor-pointer"
        >
          <input
            id="agree-payment"
            type="checkbox"
            checked={agreedPayment}
            onChange={(e) => setAgreedPayment(e.target.checked)}
            className="mt-0.5 size-4 rounded border-gray-300 accent-green-600 cursor-pointer shrink-0"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            I authorize Klare to move funds on my behalf through the{" "}
            <Link
              href="#"
              className="text-green-600 underline underline-offset-2"
            >
              Moolre payment gateway
            </Link>
            .
          </span>
        </label>
      </div>

      <button
        id="signup-step3-submit"
        type="submit"
        disabled={!agreedTerms || !agreedPayment}
        className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 active:scale-[0.985] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 disabled:opacity-50 disabled:pointer-events-none"
      >
        Continue
      </button>
    </form>
  );
}

// Check email screen
function CheckEmail({ email }: { email: string }) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center">
      {/* Icon — large rounded square with coral bg */}
      <div className="size-20 rounded-2xl bg-[#fde8e0] flex items-center justify-center mb-6">
        <Mail className="size-10 text-[#d85a30]" />
      </div>

      <h2 className="text-gray-900 text-3xl font-bold mb-3">
        Check your email
      </h2>

      <p className="text-gray-500 text-sm leading-relaxed mb-1">
        We sent a verification link and your wallet details to
      </p>
      <p className="text-gray-900 text-sm font-bold mb-4">{email}</p>

      <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
        Click the link in that email to verify your company and activate your
        Moolre wallet.
      </p>

      <Link
        href="/signin"
        id="signup-back-to-signin"
        className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 active:scale-[0.985] transition-all duration-150 text-center block mb-4"
      >
        Back to sign in
      </Link>

      <p className="text-sm text-gray-500">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          className="font-semibold text-green-700 hover:underline underline-offset-2"
        >
          Resend email
        </button>
      </p>
    </div>
  );
}

// Page
export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [companyData, setCompanyData] = useState<CompanyValues>({
    companyName: "",
    registrationNo: "",
    industry: "",
  });
  const [adminEmail, setAdminEmail] = useState("");

  return (
    <>
      {step === 1 && (
        <StepCompany
          onNext={(data) => {
            setCompanyData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <StepAdmin
          onNext={(data) => {
            setAdminEmail(data.email);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepConfirm
          companyName={companyData.companyName}
          onSubmit={() => setStep("done")}
          onBack={() => setStep(2)}
        />
      )}
      {step === "done" && <CheckEmail email={adminEmail} />}
    </>
  );
}
