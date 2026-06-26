"use client";

import { ConfirmPayrollModal } from "@/components/modals/confirm-payroll-modal";
import { PayrollHistoryTable } from "@/components/tables/payroll-history-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiError } from "@/hooks/use-auth";
import {
  useConfirmPayroll,
  useInitiatePayroll,
  usePayrollOverview,
} from "@/hooks/use-dashboard";
import { mapPayrollRun } from "@/lib/dashboard-mappers";
import { formatCurrency, ordinalDay, toNumber } from "@/lib/format";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function PayrollPage() {
  const { data, isLoading } = usePayrollOverview();
  const initiatePayroll = useInitiatePayroll();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payrollRunId, setPayrollRunId] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState("****2233");

  const confirmPayroll = useConfirmPayroll(payrollRunId);
  const overview = data?.data;

  const employeeCount = overview?.run.activeEmployees ?? 0;
  const totalToPay = toNumber(overview?.run.totalToPay);
  const walletBalance = toNumber(overview?.run.walletBalance);
  const coveragePercent = overview?.run.coveragePercent ?? 0;
  const isFunded = overview?.run.walletCoversInFull ?? false;

  const history = useMemo(
    () => (overview?.history ?? []).map(mapPayrollRun),
    [overview?.history],
  );

  const handleRunPayroll = async () => {
    try {
      const result = await initiatePayroll.mutateAsync();
      setPayrollRunId(result.data.runId);
      setMaskedPhone(result.data.maskedPhone);
      setIsConfirmOpen(true);
      if (result.data.sandboxCode) {
        toast.info(`Sandbox OTP: ${result.data.sandboxCode}`, { duration: 10000 });
      }
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleConfirmPayroll = async (otp: string) => {
    try {
      await confirmPayroll.mutateAsync({ code: otp });
      setIsConfirmOpen(false);
      setPayrollRunId(null);
      toast.success("Payroll processed successfully.");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Run payroll</h3>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
              {employeeCount} active
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-1 font-space-grotesk">
            {isLoading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              formatCurrency(totalToPay)
            )}
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {isLoading ? (
              <Skeleton inline className="h-4 w-32" />
            ) : (
              `to ${employeeCount} employees`
            )}
          </p>

          <div className="mb-4">
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              {isLoading ? (
                <div className="h-full">
                  <Skeleton className="h-2.5 rounded-full w-full" />
                </div>
              ) : (
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isFunded ? "bg-green-600" : "bg-amber-600"
                    }`}
                  style={{ width: `${coveragePercent}%` }}
                />
              )}
            </div>
          </div>

          {isFunded ? (
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-semibold mb-6">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Your wallet covers this run</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold mb-6">
              <AlertTriangle className="size-4 shrink-0" />
              <span>Wallet covers {coveragePercent}% only — top up first</span>
            </div>
          )}

          <button
            onClick={handleRunPayroll}
            disabled={initiatePayroll.isPending || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.985] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="size-4" />
            <span>
              {initiatePayroll.isPending ? "Starting…" : "Run payroll now"}
            </span>
          </button>

          <p className="text-xs text-gray-400 text-center mt-3 select-none">
            Only active employees are paid. You&apos;ll confirm with an SMS
            code.
          </p>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="mb-5">
            <h3 className="text-base font-bold text-gray-900">
              Automatic schedule
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Klare runs payroll for you, hands-free.
            </p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Pay date</span>
              <span className="text-sm font-semibold text-gray-900">
                {isLoading ? (
                  <Skeleton inline className="h-4 w-28" />
                ) : overview ? (
                  `${ordinalDay(overview.schedule.payDate)} of month`
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Notify employees</span>
              <span className="text-sm font-semibold text-green-600">
                {isLoading ? (
                  <Skeleton inline className="h-4 w-24" />
                ) : overview?.schedule.notifyEmployeesBeforePayday ? (
                  `${overview.schedule.notifyLeadDays} days before`
                ) : (
                  "Off"
                )}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-green-600" />
                {isLoading ? (
                  <Skeleton inline className="h-4 w-16" />
                ) : (
                  (overview?.schedule.status ?? "—")
                )}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="w-full mt-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-center block"
          >
            Edit schedule
          </Link>
        </div>
      </div>

      <PayrollHistoryTable data={history} isLoading={isLoading} />

      <ConfirmPayrollModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPayrollRunId(null);
        }}
        onConfirm={handleConfirmPayroll}
        totalToPay={totalToPay}
        walletBalance={walletBalance}
        employeeCount={employeeCount}
        maskedPhone={maskedPhone}
        isSubmitting={confirmPayroll.isPending}
      />
    </div>
  );
}
