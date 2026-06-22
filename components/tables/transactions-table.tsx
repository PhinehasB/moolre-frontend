"use client";

import { Transaction } from "@/interfaces/tables.interface";
import { TRANSACTIONS_HISTORY } from "@/utils/mock";
import { DataTable } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function TransactionsTable() {
  const [data] = useState<Transaction[]>(TRANSACTIONS_HISTORY);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Inflows" | "Payouts" | "Failed"
  >("All");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
          <span className="text-sm text-gray-400">
            {row.original.reference}
          </span>
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
          } else {
            return (
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-red-600" />
                Failed
              </span>
            );
          }
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
              className={`text-sm font-bold whitespace-nowrap ${
                isPositive ? "text-green-600" : "text-gray-900"
              }`}
            >
              {isPositive ? "+" : "-"}GHS {amount.toLocaleString()}
            </span>
          );
        },
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Inflows" && item.type === "inflow" && item.status === "Success") ||
        (statusFilter === "Payouts" && item.type === "payout" && item.status === "Success") ||
        (statusFilter === "Failed" && item.status === "Failed");

      const matchesSearch =
        item.description.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.reference.toLowerCase().includes(globalFilter.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [data, globalFilter, statusFilter]);

  const { table, tableElement } = DataTable<Transaction>({
    columns,
    data: filteredData,
    pagination,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    emptyMessage: "No transactions found matching your filters.",
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Header section is in page.tsx normally, but controls are here */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border-b border-gray-100 select-none">
          <div className="flex items-center gap-4 flex-1">
            {/* Search Box */}
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

            {/* Tabs */}
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

          {/* Export Button */}
          <button
            onClick={() => alert("Exporting transactions (simulation)")}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-sm shrink-0"
          >
            <Download className="size-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Table View */}
        {tableElement}

        {/* Pagination */}
        <TablePagination
          table={table}
          totalItems={filteredData.length}
          itemLabel="transactions"
        />
      </div>
    </div>
  );
}
