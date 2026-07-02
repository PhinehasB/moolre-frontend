"use client";

import { TransactionsTable } from "@/components/tables/transactions-table";
import { useTransactions } from "@/hooks/use-dashboard";
import { formatCurrency, toNumber } from "@/lib/format";
import { mapLedgerEntry } from "@/lib/dashboard-mappers";
import { ArrowDown, ArrowUp, Activity } from "lucide-react";
import { useMemo } from "react";

// Stat card

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

function StatCard({ label, value, sub, icon, color, isLoading }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        {isLoading ? (
          <div className="mt-1.5 h-5 w-28 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <p className="mt-0.5 text-lg font-bold text-gray-900 font-space-grotesk truncate">
            {value}
          </p>
        )}
        {sub && !isLoading && (
          <p className="mt-0.5 text-xs text-gray-400 font-medium">{sub}</p>
        )}
      </div>
    </div>
  );
}

// Page

export default function TransactionsPage() {
  // Fetch all transactions (no filter, no search, large page) to compute totals
  const { data, isLoading } = useTransactions({ filter: "ALL", page: 0, size: 300 });

  const allEntries = useMemo(
    () => (data?.data.content ?? []).map(mapLedgerEntry),
    [data?.data.content]
  );

  const totalInflow = allEntries
    .filter((t) => t.type === "inflow" && t.status === "Success")
    .reduce((sum, t) => sum + toNumber(t.amount), 0);

  const totalPayout = allEntries
    .filter((t) => t.type === "payout" && t.status === "Success")
    .reduce((sum, t) => sum + toNumber(t.amount), 0);

  const totalCount = data?.data.totalElements ?? 0;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Every movement on your company wallet — top-ups, payroll payouts, and fees.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total inflows"
          value={formatCurrency(totalInflow)}
          sub="Confirmed top-ups"
          icon={<ArrowDown className="size-5 text-green-600" />}
          color="bg-green-50"
          isLoading={isLoading}
        />
        <StatCard
          label="Total payouts"
          value={formatCurrency(totalPayout)}
          sub="Completed payroll runs"
          icon={<ArrowUp className="size-5 text-gray-500" />}
          color="bg-gray-100"
          isLoading={isLoading}
        />
        <StatCard
          label="Total transactions"
          value={isLoading ? "—" : String(totalCount)}
          sub="Across all time"
          icon={<Activity className="size-5 text-blue-500" />}
          color="bg-blue-50"
          isLoading={isLoading}
        />
      </div>

      {/* Table */}
      <TransactionsTable />
    </div>
  );
}