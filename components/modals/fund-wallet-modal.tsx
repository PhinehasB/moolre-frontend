"use client";

import { Modal } from "@/components/ui/modal";
import type { FundingStatus } from "@/lib/dashboard-types";
import {
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user submits the initial MoMo form */
  onRequestTopUp: (payload: { payer: string; amount: number }) => void;
  /** Called to re-check the funding status from the backend */
  onCheckStatus?: () => void;
  isSubmitting?: boolean;
  isCheckingStatus?: boolean;
  /** Current backend funding status, undefined = initial form */
  fundingStatus?: FundingStatus;
  fundingMessage?: string;
  otp?: string;
  onOtpChange?: (value: string) => void;
  onSubmitOtp?: () => void;
}

export function FundWalletModal({
  isOpen,
  onClose,
  onRequestTopUp,
  onCheckStatus,
  isSubmitting = false,
  isCheckingStatus = false,
  fundingStatus,
  fundingMessage,
  otp = "",
  onOtpChange,
  onSubmitOtp,
}: FundWalletModalProps) {
  const [amount, setAmount] = useState("10000");
  const [payer, setPayer] = useState("");

  // Auto-poll every 8 seconds while AWAITING_APPROVAL
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (fundingStatus === "AWAITING_APPROVAL" && onCheckStatus) {
      pollRef.current = setInterval(onCheckStatus, 8000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fundingStatus, onCheckStatus]);

  const parsedAmount = Number(amount.replace(/[^\d.]/g, ""));
  const canSubmit =
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    payer.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onRequestTopUp({ payer: payer.trim(), amount: parsedAmount });
  };

  // Shared modal title/desc by step 
  const titleMap: Record<string, string> = {
    AWAITING_OTP: "Enter your OTP",
    AWAITING_APPROVAL: "Approve on your phone",
    SUCCESS: "Top-up successful",
    FAILED: "Top-up failed",
  };
  const descMap: Record<string, string> = {
    AWAITING_OTP: "An OTP was sent to your mobile money number.",
    AWAITING_APPROVAL:
      "A payment prompt has been sent. Approve it on your phone.",
    SUCCESS: "Your wallet has been credited.",
    FAILED: "The top-up could not be completed.",
  };

  const title = fundingStatus ? (titleMap[fundingStatus] ?? "Fund wallet") : "Fund wallet";
  const description = fundingStatus
    ? (descMap[fundingStatus] ?? "Add money so payroll always goes through.")
    : "Add money so payroll always goes through.";

  // Terminal states
  if (fundingStatus === "SUCCESS") {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}
        footer={
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
          >
            Done
          </button>
        }
      >
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="size-9 text-green-600" />
          </div>
          <p className="text-center text-sm font-medium text-gray-600">
            {fundingMessage ?? "Your wallet has been topped up successfully."}
          </p>
        </div>
      </Modal>
    );
  }

  if (fundingStatus === "FAILED") {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}
        footer={
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        }
      >
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="size-9 text-red-500" />
          </div>
          <p className="text-center text-sm font-medium text-gray-600">
            {fundingMessage ?? "Your payment could not be processed. Please try again."}
          </p>
        </div>
      </Modal>
    );
  }

  // Awaiting approval (USSD push) 
  if (fundingStatus === "AWAITING_APPROVAL") {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}
        footer={
          <>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onCheckStatus}
              disabled={isCheckingStatus}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {isCheckingStatus ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Check status
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-50">
            <Smartphone className="size-8 text-amber-600" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm font-semibold text-gray-900">
              {fundingMessage ?? "Approve the prompt on your phone"}
            </p>
            <p className="text-xs font-medium text-gray-500">
              Checking automatically every 8 seconds…
            </p>
          </div>
          {/* Pulsing dots animation */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-2 rounded-full bg-amber-400"
                style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </Modal>
    );
  }

  // OTP step
  if (fundingStatus === "AWAITING_OTP") {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title} description={description}
        footer={
          <>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmitOtp}
              disabled={isSubmitting || otp.trim().length < 4}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Verifying…
                </span>
              ) : (
                "Submit OTP"
              )}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p className="text-xs font-medium leading-relaxed text-amber-800">
              {fundingMessage ?? "Enter the OTP sent to your mobile money number to continue."}
            </p>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            OTP code
            <input
              value={otp}
              onChange={(e) => onOtpChange?.(e.target.value)}
              inputMode="numeric"
              maxLength={10}
              autoFocus
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              placeholder="Enter OTP from your phone"
            />
          </label>
        </div>
      </Modal>
    );
  }

  // Initial form
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fund wallet"
      description="Add money to your wallet so payroll always goes through."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Processing…
              </span>
            ) : (
              "Request top-up"
            )}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Amount (GHS)
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
              GHS
            </span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              placeholder="10,000"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Mobile money number
          <input
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            inputMode="tel"
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            placeholder="0501234567"
          />
        </label>

        <p className="text-xs font-medium text-gray-500">
          A USSD payment prompt will be sent to this number to approve the top-up. Supports MTN, Telecel and AT MoMo.
        </p>
      </div>
    </Modal>
  );
}
