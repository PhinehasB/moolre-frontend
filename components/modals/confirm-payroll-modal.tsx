"use client";

import { Modal } from "@/components/ui/modal";
import { OtpBoxInput } from "@/components/ui/otp-box-input";
import { useEffect, useState } from "react";

interface ConfirmPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  totalToPay: number;
  walletBalance: number;
  employeeCount: number;
  maskedPhone?: string;
  isSubmitting?: boolean;
}

export function ConfirmPayrollModal({
  isOpen,
  onClose,
  onConfirm,
  totalToPay,
  walletBalance,
  employeeCount,
  maskedPhone = "****2233",
  isSubmitting = false,
}: ConfirmPayrollModalProps) {
  const [otp, setOtp] = useState<string>("");

  // Reset OTP on open
  useEffect(() => {
    if (isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  const otpComplete = otp.length === 6;
  const otpString = otp;

  const handleSubmit = () => {
    if (otpComplete) {
      onConfirm(otpString);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm payroll"
      description={`You're about to pay ${employeeCount} employees.`}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!otpComplete || isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm active:scale-95 duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing…" : "Confirm & pay"}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-6">
        {/* Amount summary */}
        <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 px-6 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">Total to pay</p>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
            GHS {totalToPay.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            from your wallet of GHS {walletBalance.toLocaleString()}
          </p>
        </div>

        {/* OTP section */}
        <div className="w-full text-center">
          <p className="text-sm text-gray-600 mb-4">
            Enter the 6-digit code we texted to {maskedPhone}
          </p>

          {/* OTP inputs */}
          <OtpBoxInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
