"use client";

import { FundWalletModal } from "@/components/modals/fund-wallet-modal";
import { DataTable } from "@/components/ui/data-table";
import { Transaction } from "@/interfaces/tables.interface";
import { bankDetails, TRANSACTIONS_HISTORY } from "@/utils/mock";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowRight,
  Clipboard,
  CreditCard,
  Landmark,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function WalletPage() {
  const [isFundWalletOpen, setIsFundWalletOpen] = useState(false);
  const ledger = useMemo(() => TRANSACTIONS_HISTORY.slice(1, 7), []);

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
          <span className="text-sm text-gray-400">
            {row.original.reference}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const isSuccess = row.original.status === "Success";

          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isSuccess
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isSuccess ? "bg-green-600" : "bg-red-600"
                }`}
              />
              {row.original.status}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ row }) => {
          const isInflow = row.original.type === "inflow";

          return (
            <span
              className={`block whitespace-nowrap text-right text-sm font-bold ${
                isInflow ? "text-green-600" : "text-gray-900"
              }`}
            >
              {isInflow ? "+" : "-"}GHS {row.original.amount.toLocaleString()}
            </span>
          );
        },
      },
    ],
    [],
  );

  const { tableElement } = DataTable<Transaction>({
    columns,
    data: ledger,
    pageSize: ledger.length,
    getRowId: (row) => row.id,
    emptyMessage: "No wallet ledger entries yet.",
  });

  const handleTopUpRequest = (amount: number) => {
    setIsFundWalletOpen(false);
    alert(`Top-up request sent for GHS ${amount.toLocaleString()}`);
  };

  return (
    <>
      <div className="flex w-full max-w-300 flex-col gap-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className="flex min-h-56 flex-col justify-between rounded-2xl bg-green-700 p-7 text-white shadow-sm">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs font-medium text-white/60">
                <CreditCard className="size-4" />
                <span>Moolre business wallet - TechCorp Ltd</span>
              </div>
              <p className="text-4xl font-semibold tracking-tight md:text-5xl">
                GHS 38,200
              </p>
              <p className="mt-4 text-sm font-medium text-white/65">
                Settlement account - ****4471
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFundWalletOpen(true)}
              className="mt-8 inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-green-700 shadow-sm transition-colors hover:bg-white/95"
            >
              <Plus className="size-4" />
              Fund wallet
            </button>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Landmark className="size-4 text-green-600" />
                <h2 className="text-base font-bold text-gray-900">
                  Top up by bank transfer
                </h2>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-500">
                Send to this Moolre virtual account, funds reflect instantly.
              </p>
            </div>

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
                      onClick={() => alert(`Copied ${item.label}`)}
                      className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
                      aria-label={`Copy ${item.label}`}
                    >
                      <Clipboard className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

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

      <FundWalletModal
        isOpen={isFundWalletOpen}
        onClose={() => setIsFundWalletOpen(false)}
        onRequestTopUp={handleTopUpRequest}
      />
    </>
  );
}
