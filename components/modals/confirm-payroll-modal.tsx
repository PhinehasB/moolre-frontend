"use client";

import { Modal } from "@/components/ui/modal";
import { useEffect, useRef, useState } from "react";

interface ConfirmPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  totalToPay: number;
  walletBalance: number;
  employeeCount: number;
  maskedPhone?: string;
}

export function ConfirmPayrollModal({
  isOpen,
  onClose,
  onConfirm,
  totalToPay,
  walletBalance,
  employeeCount,
  maskedPhone = "****2233",
}: ConfirmPayrollModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset OTP on open
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      // Focus first input after a short delay for animation
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const otpComplete = otp.every((digit) => digit !== "");
  const otpString = otp.join("");

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
            disabled={!otpComplete}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm active:scale-95 duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm & pay
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
          <div className="flex items-center justify-center gap-2.5">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`size-12 text-center text-lg font-semibold border rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                  digit
                    ? "border-green-600 text-gray-900"
                    : "border-gray-200 text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
