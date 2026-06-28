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
import { ArrowDown, ArrowUp, Download, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Status badge 

function StatusBadge({ status }: { status: string }) {
  if (status === "Success") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
        <span className="size-1.5 rounded-full bg-green-500" />
        Success
      </span>
    );
  }
  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
        <span className="size-1.5 rounded-full bg-amber-400" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
      <span className="size-1.5 rounded-full bg-red-500" />
      Failed
    </span>
  );
}

// Row skeletons

function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[48, 160, 96, 80, 80].map((w, i) => (
        <td key={i} className="px-6 py-4">
          <div
            className="h-3.5 rounded-full bg-gray-200"
            style={{ width: w }}
          />
        </td>
      ))}
    </tr>
  );
}

//  Type labels

const FILTER_TABS = ["All", "Inflows", "Payouts", "Failed"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

// Component

export function TransactionsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterTab>("All");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [isExporting, setIsExporting] = useState(false);

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

  // Columns
  const columns = useMemo<ColumnDef<Transaction, unknown>[]>(
    () => [
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
            {row.original.date}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "DESCRIPTION",
        cell: ({ row }) => {
          const isInflow = row.original.type === "inflow";
          return (
            <div className="flex items-center gap-2.5">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${isInflow
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-500"
                  }`}
              >
                {isInflow ? (
                  <ArrowDown className="size-3.5" />
                ) : (
                  <ArrowUp className="size-3.5" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-900 max-w-[220px] truncate">
                {row.original.description}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "reference",
        header: "REFERENCE",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gray-400 tracking-wide">
            {row.original.reference}
          </span>
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
          const { amount, type } = row.original;
          const isInflow = type === "inflow";
          return (
            <span
              className={`text-sm font-bold whitespace-nowrap font-space-grotesk ${isInflow ? "text-green-600" : "text-gray-900"
                }`}
            >
              {isInflow ? "+" : "−"}
              {formatCurrency(amount)}
            </span>
          );
        },
      },
    ],
    []
  );

  //  Handlers 
  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
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
      toast.success("Transactions exported successfully.");
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setIsExporting(false);
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
      ? "Loading transactions…"
      : "No transactions found matching your filters.",
  });

  // Render
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-b border-gray-100">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <input
            id="transactions-search"
            type="text"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            placeholder="Search description or reference…"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {FILTER_TABS.map((tab) => {
              const isActive = statusFilter === tab;
              return (
                <button
                  key={tab}
                  id={`txn-filter-${tab.toLowerCase()}`}
                  onClick={() => {
                    setStatusFilter(tab);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  }}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Export */}
          <button
            id="export-transactions-btn"
            onClick={handleExport}
            disabled={isExporting || totalCount === 0}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            <span>{isExporting ? "Exporting…" : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Table body */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["DATE", "DESCRIPTION", "REFERENCE", "STATUS", "AMOUNT"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        tableElement
      )}

      {/* Pagination */}
      <TablePagination table={table} totalItems={totalCount} itemLabel="transactions" />
    </div>
  );
}
