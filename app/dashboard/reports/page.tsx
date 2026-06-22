"use client";

import { DataTable } from "@/components/ui/data-table";
import { Report } from "@/interfaces/tables.interface";
import { reports, summaryCards } from "@/utils/mock";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownToLine } from "lucide-react";
import { useMemo } from "react";

export default function ReportsPage() {
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
            onClick={() => alert(`Downloading ${row.original.name}...`)}
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
    pageSize: reports.length,
    getRowId: (row) => row.id,
    emptyMessage: "No reports available yet.",
  });

  return (
    <div className="flex w-full max-w-300 flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {summaryCards.map((card) => {
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
          {tableElement}
        </div>
      </section>
    </div>
  );
}
