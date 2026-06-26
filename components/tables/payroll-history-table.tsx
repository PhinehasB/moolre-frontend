"use client";

import { PayrollRun } from "@/interfaces/tables.interface";
import { DataTable } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { getApiError } from "@/hooks/use-auth";
import { downloadAuthenticatedFile } from "@/lib/download";
import { formatCurrency } from "@/lib/format";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface PayrollHistoryTableProps {
  data?: PayrollRun[];
  isLoading?: boolean;
}

export function PayrollHistoryTable({
  data = [],
  isLoading = false,
}: PayrollHistoryTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleDownload = async (run: PayrollRun) => {
    try {
      await downloadAuthenticatedFile(
        `/api/v1/payroll/runs/${run.id}/report`,
        `${run.period.replace(/\s+/g, "-").toLowerCase()}-payroll.csv`
      );
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const columns = useMemo<ColumnDef<PayrollRun, unknown>[]>(
    () => [
      {
        accessorKey: "period",
        header: "PERIOD",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-gray-900">
            {row.original.period}
          </span>
        ),
      },
      {
        accessorKey: "runDate",
        header: "RUN DATE",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">{row.original.runDate}</span>
        ),
      },
      {
        accessorKey: "employees",
        header: "EMPLOYEES",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700 font-medium">
            {row.original.employees}
          </span>
        ),
      },
      {
        accessorKey: "successRate",
        header: "SUCCESS",
        cell: ({ row }) => {
          const rate = row.original.successRate;
          const isFullSuccess = rate === 100;
          return (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                isFullSuccess ? "text-green-600" : "text-amber-600"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isFullSuccess ? "bg-green-600" : "bg-amber-600"
                }`}
              />
              {rate}%
            </span>
          );
        },
      },
      {
        accessorKey: "totalPaid",
        header: "TOTAL PAID",
        cell: ({ row }) => (
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap font-space-grotesk">
            {formatCurrency(row.original.totalPaid)}
          </span>
        ),
      },
      {
        id: "download",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => handleDownload(row.original)}
            className="flex items-center justify-center size-9 rounded-lg text-gray-400 hover:text-green-600 hover:bg-gray-100 transition-colors"
            aria-label={`Download ${row.original.period} receipt`}
          >
            <Download className="size-4" />
          </button>
        ),
        size: 56,
      },
    ],
    []
  );

  const { table, tableElement } = DataTable<PayrollRun>({
    columns,
    data,
    pagination,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    emptyMessage: isLoading ? "Loading payroll history..." : "No payroll history yet.",
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-gray-900 select-none">Payroll history</h3>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {tableElement}

        {data.length > pagination.pageSize && (
          <TablePagination
            table={table}
            totalItems={data.length}
            itemLabel="payroll runs"
          />
        )}
      </div>
    </div>
  );
}
