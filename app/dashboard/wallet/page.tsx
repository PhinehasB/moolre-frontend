"use client";

import { FundWalletModal } from "@/components/modals/fund-wallet-modal";
import { DataTable } from "@/components/ui/data-table";
import { Transaction } from "@/interfaces/tables.interface";
import {
  useCheckFundingStatus,
  useFundWallet,
  useSubmitFundingOtp,
  useWallet,
} from "@/hooks/use-dashboard";
import { getApiError } from "@/hooks/use-auth";
import { mapLedgerEntry } from "@/lib/dashboard-mappers";
import type { FundingStatus } from "@/lib/dashboard-types";
import { formatCurrency, formatCurrencyParts, toNumber } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowRight,
  Clipboard,
  CreditCard,
  Landmark,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Skeleton ────────────────────────────────────────────────────────────────

function WalletCardSkeleton() {
  return (
    <div className="flex min-h-56 flex-col justify-between rounded-2xl bg-green-700/20 p-7 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 w-40 rounded-full bg-green-200/60" />
        <div className="h-12 w-52 rounded-xl bg-green-200/60" />
        <div className="h-3 w-28 rounded-full bg-green-200/60" />
      </div>
      <div className="h-10 w-32 rounded-lg bg-green-200/60" />
    </div>
  );
}

function BankCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse space-y-5">
      <div className="space-y-2">
        <div className="h-4 w-32 rounded-full bg-gray-200" />
        <div className="h-3 w-48 rounded-full bg-gray-100" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="h-3 w-20 rounded-full bg-gray-200" />
          <div className="h-3 w-28 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase();
  const colorMap: Record<string, string> = {
    success: "bg-green-50 text-green-700",
    failed: "bg-red-50 text-red-600",
    pending: "bg-amber-50 text-amber-700",
  };
  const dotMap: Record<string, string> = {
    success: "bg-green-500",
    failed: "bg-red-500",
    pending: "bg-amber-500",
  };
  const color = colorMap[normalized] ?? "bg-gray-100 text-gray-600";
  const dot = dotMap[normalized] ?? "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const { data, isLoading } = useWallet();
  const fundWallet = useFundWallet();

  const [isFundWalletOpen, setIsFundWalletOpen] = useState(false);
  const [fundingRef, setFundingRef] = useState<string | null>(null);
  const [fundingStatus, setFundingStatus] = useState<FundingStatus | undefined>(undefined);
  const [fundingMessage, setFundingMessage] = useState<string>("");
  const [fundingOtp, setFundingOtp] = useState("");

  const submitFundingOtp = useSubmitFundingOtp(fundingRef);
  const checkFundingStatus = useCheckFundingStatus(fundingRef);

  const wallet = data?.data;
  const currency = wallet?.currency ?? "GHS";

  const ledger = useMemo(
    () => (wallet?.ledger ?? []).map(mapLedgerEntry),
    [wallet?.ledger]
  );

  const balanceParts = formatCurrencyParts(toNumber(wallet?.balance));
  const pendingAmount = toNumber(wallet?.pending);

  // ─── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-gray-500">
            {row.original.date}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "DESCRIPTION",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-gray-900">
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: "reference",
        header: "REFERENCE",
        cell: ({ row }) => (
          <span className="text-sm text-gray-400">{row.original.reference}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ row }) => {
          const isInflow = row.original.type === "inflow";
          return (
            <span
              className={`block whitespace-nowrap text-right text-sm font-bold font-space-grotesk ${
                isInflow ? "text-green-600" : "text-gray-900"
              }`}
            >
              {isInflow ? "+" : "−"}
              {formatCurrency(row.original.amount, currency)}
            </span>
          );
        },
      },
    ],
    [currency]
  );

  const { tableElement } = DataTable<Transaction>({
    columns,
    data: ledger,
    pageSize: ledger.length || 10,
    getRowId: (row) => row.id,
    emptyMessage: isLoading ? "Loading ledger…" : "No wallet transactions yet.",
  });

  // ─── Bank details ──────────────────────────────────────────────────────────
  const bankDetails = wallet?.bankTopUp
    ? [
        { label: "Account name", value: wallet.bankTopUp.accountName ?? "—" },
        { label: "Account number", value: wallet.bankTopUp.accountNumber ?? "—" },
        { label: "Bank", value: wallet.bankTopUp.bankName ?? "—" },
      ]
    : [];

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const resetFundingState = () => {
    setFundingRef(null);
    setFundingStatus(undefined);
    setFundingMessage("");
    setFundingOtp("");
  };

  const handleTopUpRequest = async (payload: { payer: string; amount: number }) => {
    try {
      const result = await fundWallet.mutateAsync(payload);
      const fd = result.data;
      setFundingRef(fd.externalRef);
      setFundingStatus(fd.status);
      setFundingMessage(fd.message ?? "");
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleSubmitOtp = async () => {
    if (!fundingOtp.trim()) return;
    try {
      const result = await submitFundingOtp.mutateAsync({ otpcode: fundingOtp });
      const fd = result.data;
      setFundingStatus(fd.status);
      setFundingMessage(fd.message ?? "");
      if (fd.status === "SUCCESS") {
        toast.success(fd.message ?? "Wallet funded successfully.");
      }
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleCheckStatus = async () => {
    if (!fundingRef) return;
    try {
      const result = await checkFundingStatus.mutateAsync();
      const fd = result.data;
      setFundingStatus(fd.status);
      setFundingMessage(fd.message ?? "");
      if (fd.status === "SUCCESS") {
        toast.success(fd.message ?? "Wallet funded successfully.");
      } else if (fd.status === "FAILED") {
        toast.error(fd.message ?? "Payment failed.");
      }
    } catch {
      // silently ignore polling errors
    }
  };

  const copyToClipboard = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error("Unable to copy to clipboard.");
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex w-full max-w-300 flex-col gap-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">

          {/* ── Wallet balance card ── */}
          {isLoading ? (
            <WalletCardSkeleton />
          ) : (
            <section className="flex min-h-56 flex-col justify-between rounded-2xl bg-green-700 p-7 text-white shadow-sm">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-medium text-white/60">
                  <CreditCard className="size-4" />
                  <span>
                    Moolre business wallet
                    {wallet?.companyName ? ` – ${wallet.companyName}` : ""}
                  </span>
                </div>

                <p className="text-4xl font-semibold tracking-tight md:text-5xl font-space-grotesk">
                  {currency}{" "}
                  {balanceParts.whole}.
                  <span className="text-2xl font-normal text-white/70">
                    {balanceParts.fraction}
                  </span>
                </p>

                {/* Pending balance badge */}
                {pendingAmount > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    <TrendingUp className="size-3" />
                    <span className="font-space-grotesk">{formatCurrency(pendingAmount, currency)}</span> pending
                  </div>
                )}

                <p className="mt-3 text-sm font-medium text-white/65">
                  Settlement account – {wallet?.settlementAccountMasked ?? "—"}
                </p>
              </div>

              <button
                type="button"
                id="fund-wallet-btn"
                onClick={() => {
                  resetFundingState();
                  setIsFundWalletOpen(true);
                }}
                className="mt-8 inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-green-700 shadow-sm transition-colors hover:bg-white/95"
              >
                <Plus className="size-4" />
                Fund wallet
              </button>
            </section>
          )}

          {/* ── Bank top-up card ── */}
          {isLoading ? (
            <BankCardSkeleton />
          ) : (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Landmark className="size-4 text-green-600" />
                  <h2 className="text-base font-bold text-gray-900">
                    Top up by bank transfer
                  </h2>
                </div>
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Send to this Moolre virtual account — funds reflect instantly.
                </p>
              </div>

              {bankDetails.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {bankDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-medium text-gray-500">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {item.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.label, item.value)}
                          className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
                          aria-label={`Copy ${item.label}`}
                        >
                          <Clipboard className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Bank account is being provisioned…
                </p>
              )}
            </section>
          )}
        </div>

        {/* ── Ledger ── */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Wallet ledger</h2>
            <Link
              href="/dashboard/transactions"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 transition-colors hover:text-green-700"
            >
              All transactions
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {tableElement}
          </div>
        </section>
      </div>

      {/* ── Fund wallet modal ── */}
      <FundWalletModal
        isOpen={isFundWalletOpen}
        onClose={() => {
          // Only allow closing if we're not mid-flow (or if terminal)
          const closable =
            !fundingStatus ||
            fundingStatus === "SUCCESS" ||
            fundingStatus === "FAILED";
          if (closable) {
            setIsFundWalletOpen(false);
            resetFundingState();
          } else {
            setIsFundWalletOpen(false);
          }
        }}
        onRequestTopUp={handleTopUpRequest}
        onCheckStatus={handleCheckStatus}
        isSubmitting={fundWallet.isPending || submitFundingOtp.isPending}
        isCheckingStatus={checkFundingStatus.isPending}
        fundingStatus={fundingStatus}
        fundingMessage={fundingMessage}
        otp={fundingOtp}
        onOtpChange={setFundingOtp}
        onSubmitOtp={handleSubmitOtp}
      />
    </>
  );
}
