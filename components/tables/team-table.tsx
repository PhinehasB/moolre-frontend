"use client";

import { Employee, TeamTableProps } from "@/interfaces/tables.interface";
import { INITIAL_DATA } from "@/utils/mock";
import { DataTable } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { AddEmployeeModal } from "@/components/modals/add-employee-modal";
import { ImportCSVModal } from "@/components/modals/import-csv-modal";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  ArrowRight,
  Check,
  Circle,
  FileSpreadsheet,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { redirect } from "next/navigation";

export function TeamTable({
  initialData = INITIAL_DATA,
  title = "",
  showViewAll = true,
  onViewAll,
  onAddEmployee,
}: TeamTableProps) {
  const [data, setData] = useState<Employee[]>(initialData);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Pending" | "Suspended"
  >("All");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: showViewAll ? 5 : 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const columns = useMemo<ColumnDef<Employee, unknown>[]>(
    () => [
      // Checkbox column (only on team page)
      ...(!showViewAll
        ? [
          {
            id: "select",
            header: ({ table }: any) => (
              <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
                className="size-4 rounded border-gray-300 text-green-600 accent-green-600 cursor-pointer"
                aria-label="Select all"
              />
            ),
            cell: ({ row }: any) => (
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="size-4 rounded border-gray-300 text-green-600 accent-green-600 cursor-pointer"
                aria-label={`Select ${row.original.name}`}
              />
            ),
            size: 48,
            enableSorting: false,
          } as ColumnDef<Employee, unknown>,
        ]
        : []),
      {
        accessorKey: "employee",
        header: "EMPLOYEE",
        cell: ({ row }) => {
          const emp = row.original;
          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-full text-xs font-semibold select-none shrink-0 ${emp.avatarColor}`}
              >
                {getInitials(emp.name)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm">
                  {emp.name}
                </span>
                <span className="text-xs text-gray-500">{emp.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: "PHONE",
        cell: ({ row }) => (
          <span className="text-sm text-gray-900 font-medium">
            {row.original.phone}
          </span>
        ),
      },
      {
        accessorKey: "wallet",
        header: "WALLET",
        cell: ({ row }) => {
          const wallet = row.original.wallet;
          return wallet === "Linked" ? (
            <div className="flex items-center gap-1.5 text-green-400 font-medium text-sm select-none">
              <Check className="size-4 shrink-0" />
              <span>Linked</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm select-none">
              <Circle className="size-3.5 shrink-0" />
              <span>Provisioning</span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "Active") {
            return (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-green-600" />
                Active
              </span>
            );
          } else if (status === "Pending") {
            return (
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-orange-600" />
                Pending
              </span>
            );
          } else {
            return (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-gray-500" />
                Suspended
              </span>
            );
          }
        },
      },
      {
        accessorKey: "salary",
        header: "SALARY",
        cell: ({ row }) => (
          <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
            GHS {row.original.salary.toLocaleString()}
          </span>
        ),
      },
      // Phone action column
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => alert(`Calling ${row.original.name}...`)}
            className="flex items-center justify-center size-9 rounded-lg text-gray-400 hover:text-green-600 hover:bg-gray-100 transition-colors"
            aria-label={`Call ${row.original.name}`}
          >
            <Phone className="size-4" />
          </button>
        ),
        size: 56,
      },
    ],
    []
  );

  // Filter data based on search input and status tabs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.phone.includes(globalFilter);
      return matchesStatus && matchesSearch;
    });
  }, [data, globalFilter, statusFilter]);

  // Count active employees
  const activeCount = useMemo(
    () => data.filter((e) => e.status === "Active").length,
    [data]
  );

  const handleAddEmployee = (employee: Employee, _sendInvite: boolean) => {
    setData((prev) => [...prev, employee]);
    setIsAddModalOpen(false);
    if (onAddEmployee) {
      onAddEmployee(employee);
    }
  };

  const handleImportCSV = (file: File) => {
    // In a real app, parse the CSV file here
    alert(`Imported file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    setIsImportModalOpen(false);
  };

  const { table, tableElement } = DataTable<Employee>({
    columns,
    data: filteredData,
    pagination,
    onPaginationChange: setPagination,
    ...(showViewAll
      ? {}
      : {
        rowSelection,
        onRowSelectionChange: setRowSelection,
      }),
    getRowId: (row) => row.id,
    emptyMessage: "No team members found matching your filters.",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Title Header */}
      <div className="flex items-center justify-between mt-2 select-none">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {showViewAll ? title : ""}
          </h3>
          {!showViewAll && (
            <p className="text-sm text-gray-500 mt-0.5">
              {data.length} people · {activeCount} active on payroll
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {showViewAll ? (
            <button
              onClick={
                onViewAll ||
                (() => redirect("dashboard/team"))
              }
              className="text-sm font-semibold text-green-600 hover:underline flex items-center gap-1 group"
            >
              <span>View all {data.length}</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                <FileSpreadsheet className="size-4 text-green-600" />
                <span>Import CSV</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs active:scale-95 duration-100"
              >
                <Plus className="size-4" />
                <span>Add employee</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Wrapper */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border-b border-gray-100 select-none">
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
              placeholder="Search name, email or phone"
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {/* Tabs */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              {(["All", "Active", "Pending", "Suspended"] as const).map(
                (tab) => {
                  const isActive = statusFilter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setStatusFilter(tab);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${isActive
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                      {tab}
                    </button>
                  );
                }
              )}
            </div>

            {/* Add Employee Button (compact, only when showViewAll is true / on dashboard) */}
            {showViewAll && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm active:scale-95 duration-100"
              >
                <Plus className="size-4" />
                <span>Add employee</span>
              </button>
            )}
          </div>
        </div>

        {/* Table View - using reusable DataTable */}
        {tableElement}

        {/* Pagination - only on team page */}
        {!showViewAll && (
          <TablePagination
            table={table}
            totalItems={filteredData.length}
            itemLabel="employees"
          />
        )}
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
        currentCount={data.length}
      />
      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCSV}
      />
    </div>
  );
}
