"use client";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiError } from "@/hooks/use-auth";
import { useReportsOverview } from "@/hooks/use-dashboard";
import { Report } from "@/interfaces/tables.interface";
import { mapAvailableReport } from "@/lib/dashboard-mappers";
import { downloadAuthenticatedFile } from "@/lib/download";
import { formatCurrency } from "@/lib/format";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownToLine, FileText, Users, Wallet } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
  const { data, isLoading } = useReportsOverview();
  const overview = data?.data;

  const reports = useMemo(
    () => (overview?.reports ?? []).map(mapAvailableReport),
    [overview?.reports],
  );

  const summaryCards = [
    {
      label: `Total paid in ${overview?.stats.year ?? new Date().getFullYear()}`,
      value: overview ? formatCurrency(overview.stats.totalPaid) : "—",
      helper: `${overview?.stats.payrollRuns ?? 0} payroll runs`,
      icon: Wallet,
      className: "bg-green-50 text-green-600",
    },
    {
      label: "Employees paid",
      value: overview ? String(overview.stats.employeesPaid) : "—",
      helper: "Across all completed runs",
      icon: Users,
      className: "bg-blue-50 text-blue-600",
    },
    {
      label: "Reports generated",
      value: overview ? String(overview.stats.reportsGenerated) : "—",
      helper: "Available for download",
      icon: FileText,
      className: "bg-purple-50 text-purple-600",
    },
  ];

  const handleDownload = async (report: Report) => {
    try {
      if (report.kind === "TAX_SUMMARY") {
        await downloadAuthenticatedFile(
          "/api/v1/reports/tax-summary?format=pdf",
          "tax-summary.pdf",
        );
        return;
      }

      const format = report.formats[0]?.toLowerCase() === "pdf" ? "pdf" : "csv";
      await downloadAuthenticatedFile(
        `/api/v1/reports/payroll-runs/${report.id}?format=${format}`,
        `${report.name.replace(/\s+/g, "-").toLowerCase()}.${format}`,
      );
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const columns = useMemo<ColumnDef<Report, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "REPORT",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-gray-900">
            {row.original.name}
          </span>
        ),
      },
      {
        accessorKey: "period",
        header: "PERIOD",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-gray-500">
            {row.original.period}
          </span>
        ),
      },
      {
        accessorKey: "records",
        header: "RECORDS",
        cell: ({ row }) => (
          <span className="text-sm text-gray-700">{row.original.records}</span>
        ),
      },
      {
        accessorKey: "formats",
        header: "FORMAT",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            {row.original.formats.map((format) => (
              <span
                key={format}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600"
              >
                {format}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: "download",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => handleDownload(row.original)}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-800 shadow-xs transition-colors hover:bg-gray-50"
          >
            <ArrowDownToLine className="size-3.5" />
            <span>Download</span>
          </button>
        ),
        size: 140,
      },
    ],
    [],
  );

  const { tableElement } = DataTable<Report>({
    columns,
    data: reports,
    pageSize: reports.length || 10,
    getRowId: (row) => row.id,
    emptyMessage: isLoading
      ? "Loading reports..."
      : "No reports available yet.",
  });

  return (
    <div className="flex w-full max-w-300 flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {isLoading
          ? [0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <Skeleton className="h-6 w-6 rounded-lg mb-4" inline />
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
            ))
          : summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={`flex size-8 items-center justify-center rounded-lg ${card.className}`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {card.label}
                    </span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-gray-900">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-400">
                    {card.helper}
                  </p>
                </div>
              );
            })}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-gray-900">
          Downloadable reports
        </h2>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
            </div>
          ) : (
            tableElement
          )}
        </div>
      </section>
    </div>
  );
}
