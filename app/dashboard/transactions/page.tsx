"use client";

import { TransactionsTable } from "@/components/tables/transactions-table";
import { Bell } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] animate-in fade-in duration-300">
      <TransactionsTable />
    </div>
  );
}