"use client";

import { Transaction } from "@/interfaces/tables.interface";
import { DataTable } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useTransactions } from "@/hooks/use-dashboard";
import { getApiError } from "@/hooks/use-auth";
import {
  mapLedgerEntry,
  transactionFilterToApi,
} from "@/lib/dashboard-mappers";
import { downloadAuthenticatedFile } from "@/lib/download";
import { formatCurrency } from "@/lib/format";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function TransactionsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Inflows" | "Payouts" | "Failed"
  >("All");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useTransactions({
    filter: transactionFilterToApi(statusFilter),
    q: globalFilter || undefined,
    page: pagination.pageIndex,
    size: pagination.pageSize,
  });

  const transactions = useMemo(
    () => (data?.data.content ?? []).map(mapLedgerEntry),
    [data?.data.content]
  );

  const totalCount = data?.data.totalElements ?? 0;
  const pageCount = data?.data.totalPages ?? 1;

  const columns = useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 font-medium">
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
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "Success") {
            return (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-green-600" />
                Success
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
              <span className="size-1.5 rounded-full bg-red-600" />
              Failed
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ row }) => {
          const { amount, type } = row.original;
          const isPositive = type === "inflow";
          return (
            <span
              className={`text-sm font-bold whitespace-nowrap font-space-grotesk ${
                isPositive ? "text-green-600" : "text-gray-900"
              }`}
            >
              {isPositive ? "+" : "-"}
              {formatCurrency(amount)}
            </span>
          );
        },
      },
    ],
    []
  );

  const handleExport = async () => {
    try {
      const filter = transactionFilterToApi(statusFilter);
      const query = new URLSearchParams({
        filter,
        ...(globalFilter ? { q: globalFilter } : {}),
      });
      await downloadAuthenticatedFile(
        `/api/v1/transactions/export?${query.toString()}`,
        "transactions.csv"
      );
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const { table, tableElement } = DataTable<Transaction>({
    columns,
    data: transactions,
    pagination,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount,
    getRowId: (row) => row.id,
    emptyMessage: isLoading
      ? "Loading transactions..."
      : "No transactions found matching your filters.",
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border-b border-gray-100 select-none">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                placeholder="Search description or reference"
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              {(["All", "Inflows", "Payouts", "Failed"] as const).map((tab) => {
                const isActive = statusFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setStatusFilter(tab);
                      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm shrink-0"
          >
            <Download className="size-4" />
            <span>Export</span>
          </button>
        </div>

        {tableElement}

        <TablePagination
          table={table}
          totalItems={totalCount}
          itemLabel="transactions"
        />
      </div>
    </div>
  );
}
