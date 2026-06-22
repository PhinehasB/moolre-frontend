"use client";

import { Modal } from "@/components/ui/modal";
import { useState } from "react";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestTopUp: (amount: number) => void;
}

export function FundWalletModal({
  isOpen,
  onClose,
  onRequestTopUp,
}: FundWalletModalProps) {
  const [amount, setAmount] = useState("10000");

  const parsedAmount = Number(amount.replace(/[^\d.]/g, ""));
  const canSubmit = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onRequestTopUp(parsedAmount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fund wallet"
      description="Add money so payroll always goes through."
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
            disabled={!canSubmit}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Request top-up
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Amount
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
              GHS
            </span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              placeholder="10,000"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
          Pay from
          <select
            defaultValue="mtn"
            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          >
            <option value="mtn">MTN MoMo - ****2233</option>
            <option value="bank">Bank transfer - GCB ****0471</option>
            <option value="telecel">Telecel Cash - ****9012</option>
          </select>
        </label>

        <p className="text-xs font-medium text-gray-500">
          A payment prompt will be sent to your phone to approve.
        </p>
      </div>
    </Modal>
  );
}
