"use client";

import { PayrollHistoryTable } from "@/components/tables/payroll-history-table";
import { ConfirmPayrollModal } from "@/components/modals/confirm-payroll-modal";
import { INITIAL_DATA } from "@/utils/mock";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function PayrollPage() {
  const [walletBalance, setWalletBalance] = useState(38200);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [payrollProcessed, setPayrollProcessed] = useState(false);

  // Calculate from active employees
  const activeEmployees = useMemo(
    () => INITIAL_DATA.filter((e) => e.status === "Active"),
    []
  );
  const employeeCount = activeEmployees.length;
  const totalToPay = activeEmployees.reduce((sum, e) => sum + e.salary, 0);

  const isFunded = walletBalance >= totalToPay;
  const coveragePercent = Math.min(
    100,
    Math.round((walletBalance / totalToPay) * 100)
  );

  const handleRunPayroll = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmPayroll = (otp: string) => {
    // Simulate payroll processing
    setWalletBalance((prev) => prev - totalToPay);
    setPayrollProcessed(true);
    setIsConfirmOpen(false);
    alert(`Payroll processed! OTP: ${otp}`);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Run payroll card */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900">Run payroll</h3>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
              {employeeCount} active
            </span>
          </div>

          {/* Total amount */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-1">
            GHS {totalToPay.toLocaleString()}
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            to {employeeCount} employees
          </p>

          {/* Coverage progress bar */}
          <div className="mb-4">
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isFunded ? "bg-green-600" : "bg-amber-600"
                }`}
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>

          {/* Coverage status */}
          {isFunded ? (
            <div className="flex items-center gap-1.5 text-sm text-green-600 font-semibold mb-6">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Your wallet covers this run</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold mb-6">
              <AlertTriangle className="size-4 shrink-0" />
              <span>
                Wallet covers {coveragePercent}% only — top up first
              </span>
            </div>
          )}

          {/* Run payroll button */}
          <button
            onClick={handleRunPayroll}
            disabled={payrollProcessed}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.985] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="size-4" />
            <span>Run payroll now</span>
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mt-3 select-none">
            Only active employees are paid. You&apos;ll confirm with an SMS
            code.
          </p>
        </div>

        {/* Automatic schedule card */}
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
            {/* Pay date */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Pay date</span>
              <span className="text-sm font-semibold text-gray-900">
                28th of month
              </span>
            </div>

            {/* Notify employees */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Notify employees</span>
              <span className="text-sm font-semibold text-green-600">
                2 days before
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Status</span>
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-green-600" />
                Active
              </span>
            </div>
          </div>

          {/* Edit schedule button */}
          <button
            onClick={() => alert("Edit schedule (simulation)")}
            className="w-full mt-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Edit schedule
          </button>
        </div>
      </div>

      {/* Payroll history table */}
      <PayrollHistoryTable />

      {/* Confirm payroll modal */}
      <ConfirmPayrollModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPayroll}
        totalToPay={totalToPay}
        walletBalance={walletBalance}
        employeeCount={employeeCount}
      />
    </div>
  );
}