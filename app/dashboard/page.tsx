"use client";

import { ConfirmPayrollModal } from "@/components/modals/confirm-payroll-modal";
import { FundWalletModal } from "@/components/modals/fund-wallet-modal";
import { TeamTable } from "@/components/tables/team-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiError } from "@/hooks/use-auth";
import {
  useConfirmPayroll,
  useDashboardSummary,
  useFundWallet,
  useInitiatePayroll,
  useSubmitFundingOtp,
} from "@/hooks/use-dashboard";
import { mapEmployeeResponse } from "@/lib/dashboard-mappers";
import {
  formatCurrency,
  formatCurrencyParts,
  formatLocalDate,
  toNumber,
} from "@/lib/format";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { data, isLoading } = useDashboardSummary();
  const initiatePayroll = useInitiatePayroll();
  const fundWallet = useFundWallet();

  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isPayrollOpen, setIsPayrollOpen] = useState(false);
  const [payrollRunId, setPayrollRunId] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState("****2233");
  const [fundingRef, setFundingRef] = useState<string | null>(null);
  const [fundingOtp, setFundingOtp] = useState("");

  const confirmPayroll = useConfirmPayroll(payrollRunId);
  const submitFundingOtp = useSubmitFundingOtp(fundingRef);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const summary = data?.data;
  const walletBalance = toNumber(summary?.wallet.balance);
  const pending = toNumber(summary?.wallet.pending);
  const currency = summary?.wallet.currency ?? "GHS";
  const totalToPay = toNumber(summary?.nextPayroll.totalToPay);
  const isFunded = summary?.nextPayroll.walletCoversInFull ?? false;
  const deficit = toNumber(summary?.nextPayroll.shortfall);
  const activeEmployees = summary?.stats.activeEmployees ?? 0;
  const balanceParts = formatCurrencyParts(walletBalance);
  const greeting = summary?.greeting;
  const coveragePercent = Math.min(
    100,
    totalToPay > 0 ? (walletBalance / totalToPay) * 100 : 0,
  );
  const progressWidths = [
    "w-0",
    "w-1/12",
    "w-2/12",
    "w-3/12",
    "w-4/12",
    "w-5/12",
    "w-6/12",
    "w-7/12",
    "w-8/12",
    "w-9/12",
    "w-10/12",
    "w-11/12",
    "w-full",
  ] as const;
  const progressWidthClass =
    progressWidths[
      Math.min(12, Math.max(0, Math.round((coveragePercent / 100) * 12)))
    ];

  const team = useMemo(
    () => (summary?.team ?? []).map(mapEmployeeResponse),
    [summary?.team],
  );

  const handleRunPayroll = async () => {
    try {
      const result = await initiatePayroll.mutateAsync();
      setPayrollRunId(result.data.runId);
      setMaskedPhone(result.data.maskedPhone);
      setIsPayrollOpen(true);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleConfirmPayroll = async (otp: string) => {
    try {
      await confirmPayroll.mutateAsync({ code: otp });
      setIsPayrollOpen(false);
      setPayrollRunId(null);
      toast.success("Payroll processed successfully.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleFundWallet = async (payload: {
    payer: string;
    amount: number;
  }) => {
    try {
      const result = await fundWallet.mutateAsync(payload);
      if (result.data.otpRequired) {
        setFundingRef(result.data.externalRef);
        toast.message(
          result.data.message || "Enter the OTP sent to your phone.",
        );
        return;
      }
      setIsFundOpen(false);
      toast.success(result.data.message || "Top-up request sent.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleSubmitOtp = async () => {
    if (!fundingOtp.trim()) return;
    try {
      const result = await submitFundingOtp.mutateAsync({
        otpcode: fundingOtp,
      });
      setFundingRef(null);
      setFundingOtp("");
      setIsFundOpen(false);
      toast.success(result.data.message || "Wallet funded successfully.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const stats = [
    {
      id: "active-employees",
      label: "Active employees",
      value: isLoading ? "—" : activeEmployees,
      subtext: summary
        ? `+${summary.stats.addedThisMonth} added this month`
        : "",
      subtextColor: "text-spendable font-semibold",
      icon: Users,
      iconBg: "bg-primary-50 text-primary",
    },
    {
      id: "pending-onboarding",
      label: "Pending onboarding",
      value: isLoading ? "—" : String(summary?.stats.pendingOnboarding ?? 0),
      subtext: "waiting to set their password",
      subtextColor: "text-gray-400",
      icon: UserPlus,
      iconBg: "bg-safe-50 text-safe-600",
    },
    {
      id: "paid-last-month",
      label: "Paid last month",
      value: summary
        ? formatCurrency(summary.lastPayroll.amount, currency)
        : "—",
      subtext: summary
        ? `${formatLocalDate(summary.lastPayroll.date)} • ${summary.lastPayroll.successRate}% success`
        : "",
      subtextColor: "text-gray-400",
      icon: Calendar,
      iconBg: "bg-accent-50 text-accent",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {!isLoading && !isFunded && totalToPay > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-safe-50 border border-safe-50 rounded-2xl p-4 text-sm text-safe-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-safe-50 text-safe-600 shrink-0">
              <AlertTriangle className="size-4" />
            </div>
            <p className="font-medium text-safe-800">
              Your next payroll is {formatCurrency(totalToPay, currency)} but
              your wallet sits at {formatCurrency(walletBalance, currency)}. Top
              up {formatCurrency(deficit, currency)} before{" "}
              {summary ? formatLocalDate(summary.nextPayroll.date) : "payday"}{" "}
              to pay everyone.
            </p>
          </div>
          <button
            onClick={() => setIsFundOpen(true)}
            className="bg-safe-600 hover:bg-safe-800 text-white font-semibold px-4 py-2 rounded-xl text-xs whitespace-nowrap active:scale-95 transition-all duration-150 shrink-0"
          >
            Top up wallet
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col justify-between bg-primary text-white rounded-2xl p-6 shadow-sm md:col-span-2">
          <div>
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium select-none">
                <Wallet className="size-4" />
                <span>
                  {greeting
                    ? `Hello, ${greeting.firstName}`
                    : "Moolre business wallet"}
                </span>
              </div>
              {greeting ? (
                <p className="text-white/70 text-sm">{greeting.companyName}</p>
              ) : null}
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
              {currency}{" "}
              {isLoading ? (
                <Skeleton inline className="inline-block h-8 w-28" />
              ) : (
                balanceParts.whole
              )}
              .
              <span className="text-white/60 text-2xl font-normal">
                {isLoading ? (
                  <Skeleton inline className="inline-block h-6 w-12" />
                ) : (
                  balanceParts.fraction
                )}
              </span>
            </h2>
            <div className="flex items-center gap-4 text-white/70 text-xs font-medium select-none">
              <span>Available {formatCurrency(walletBalance, currency)}</span>
              <span className="size-1 rounded-full bg-white/40" />
              <span>Pending {formatCurrency(pending, currency)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => setIsFundOpen(true)}
              className="flex items-center gap-2 bg-white text-primary hover:bg-white/95 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors active:scale-[0.985] shrink-0"
            >
              <Wallet className="size-4" />
              <span>Fund wallet</span>
            </button>
            <Link
              href="/dashboard/transactions"
              className="border border-white/20 hover:bg-white/10 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors active:scale-[0.985] shrink-0"
            >
              View statement
            </Link>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 select-none">
              <span className="text-gray-500 text-xs font-medium">
                Next automatic payroll
              </span>
              <span className="bg-primary-50 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full select-none">
                {summary?.nextPayroll.autoEnabled ? "Auto - on" : "Manual"}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isLoading ? (
                <Skeleton inline className="h-6 w-40" />
              ) : summary ? (
                formatLocalDate(summary.nextPayroll.date)
              ) : (
                "—"
              )}
            </h3>
            <p className="text-gray-500 text-xs mb-6">
              {isLoading ? (
                <Skeleton inline className="h-4 w-72" />
              ) : summary ? (
                `in ${summary.nextPayroll.inDays} days • ${summary.nextPayroll.activeEmployees} active employees`
              ) : (
                "—"
              )}
            </p>

            <hr className="border-gray-100 mb-6" />

            <span className="text-gray-500 text-xs font-medium mb-1 block select-none">
              Total to pay
            </span>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              {formatCurrency(totalToPay, currency)}
            </h4>

            <div className="mb-6 select-none">
              <div className="h-2 rounded-full bg-gray-100 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isFunded ? "bg-spendable" : "bg-safe-600"} ${progressWidthClass}`}
                />
              </div>
              {isFunded ? (
                <div className="flex items-center gap-1.5 text-xs text-spendable font-semibold">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Wallet covers payroll in full</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-safe-600 font-semibold">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>
                    Top up {formatCurrency(deficit, currency)} to cover payroll
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleRunPayroll}
            disabled={mounted ? initiatePayroll.isPending || isLoading : false}
            className="w-full bg-primary hover:bg-primary-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors active:scale-[0.985] shadow-sm mt-4 disabled:opacity-60"
          >
            {mounted
              ? initiatePayroll.isPending
                ? "Starting payroll…"
                : "Run payroll now"
              : "Run payroll now"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm select-none"
            >
              <div
                className={`flex aspect-square size-10 items-center justify-center rounded-xl mb-4 ${stat.iconBg}`}
              >
                <Icon className="size-5" />
              </div>
              <span className="text-gray-500 text-xs font-medium block mb-1">
                {stat.label}
              </span>
              <h5 className="text-3xl font-bold text-gray-900 mb-2">
                {isLoading ? (
                  <Skeleton inline className="h-8 w-20 inline-block" />
                ) : (
                  stat.value
                )}
              </h5>
              <p className={`text-xs ${stat.subtextColor}`}>{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      <TeamTable
        totalCount={summary?.stats.totalEmployees ?? 0}
        activeCount={activeEmployees}
        isLoading={isLoading}
        title="Team"
      />

      <FundWalletModal
        isOpen={isFundOpen}
        onClose={() => {
          setIsFundOpen(false);
          setFundingRef(null);
          setFundingOtp("");
        }}
        onRequestTopUp={handleFundWallet}
        isSubmitting={fundWallet.isPending || submitFundingOtp.isPending}
        otpRequired={!!fundingRef}
        otp={fundingOtp}
        onOtpChange={setFundingOtp}
        onSubmitOtp={handleSubmitOtp}
      />

      <ConfirmPayrollModal
        isOpen={isPayrollOpen}
        onClose={() => {
          setIsPayrollOpen(false);
          setPayrollRunId(null);
        }}
        onConfirm={handleConfirmPayroll}
        totalToPay={totalToPay}
        walletBalance={walletBalance}
        employeeCount={summary?.nextPayroll.activeEmployees ?? 0}
        maskedPhone={maskedPhone}
        isSubmitting={confirmPayroll.isPending}
      />
    </div>
  );
}
