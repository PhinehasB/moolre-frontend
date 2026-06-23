"use client";

import { TransactionsTable } from "@/components/tables/transactions-table";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      <TransactionsTable />
    </div>
  );
}