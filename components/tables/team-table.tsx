"use client";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/ui/table-pagination";
import { getApiError } from "@/hooks/use-auth";
import {
  useCreateEmployee,
  useEmployeeStats,
  useEmployees,
  useImportEmployees,
  useUpdateEmployee,
} from "@/hooks/use-dashboard";
import { Employee, TeamTableProps } from "@/interfaces/tables.interface";
import {
  employeeStatusToApi,
  mapEmployeeResponse,
} from "@/lib/dashboard-mappers";
import { downloadAuthenticatedFile } from "@/lib/download";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  ArrowRight,
  Check,
  Circle,
  Edit,
  FileSpreadsheet,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AddEmployeeModal } from "../modals/add-employee-modal";
import { EditEmployeeModal } from "../modals/edit-employee-modal";
import { ImportCSVModal } from "../modals/import-csv-modal";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function TeamTable({
  employees: controlledEmployees,
  totalCount: controlledTotalCount,
  activeCount: controlledActiveCount,
  isLoading: controlledLoading,
  title = "",
  showViewAll = true,
  onViewAll,
  onAddEmployee,
}: TeamTableProps) {
  const isControlled = controlledEmployees !== undefined;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const employeesQuery = useEmployees(
    {
      q: globalFilter || undefined,
      status: employeeStatusToApi(statusFilter),
      page: pagination.pageIndex,
      size: pagination.pageSize,
    },
    { enabled: !isControlled },
  );

  const statsQuery = useEmployeeStats({
    enabled: !isControlled && !showViewAll,
  });
  const createEmployee = useCreateEmployee();
  const importEmployees = useImportEmployees();
  const updateEmployee = useUpdateEmployee();

  const employees = useMemo(() => {
    if (isControlled) return controlledEmployees;
    return (employeesQuery.data?.data.content ?? []).map(mapEmployeeResponse);
  }, [controlledEmployees, employeesQuery.data, isControlled]);

  const filteredData = useMemo(() => {
    if (!isControlled) return employees;
    return employees.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.phone.includes(globalFilter);
      return matchesStatus && matchesSearch;
    });
  }, [employees, globalFilter, isControlled, statusFilter]);

  const totalCount = isControlled
    ? (controlledTotalCount ?? employees.length)
    : (employeesQuery.data?.data.totalElements ?? 0);

  const activeCount = isControlled
    ? (controlledActiveCount ??
      employees.filter((e) => e.status === "Active").length)
    : (statsQuery.data?.data.active ?? 0);

  const isLoading = isControlled
    ? !!controlledLoading
    : employeesQuery.isLoading || statsQuery.isLoading;

  const columns = useMemo<ColumnDef<Employee, unknown>[]>(
    () => [
      ...(!showViewAll
        ? [
            {
              id: "select",
              header: ({
                table,
              }: {
                table: {
                  getIsAllPageRowsSelected: () => boolean;
                  getToggleAllPageRowsSelectedHandler: () => (
                    event: unknown,
                  ) => void;
                };
              }) => (
                <input
                  type="checkbox"
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                  className="size-4 rounded border-gray-300 text-green-600 accent-green-600 cursor-pointer"
                  aria-label="Select all"
                />
              ),
              cell: ({
                row,
              }: {
                row: {
                  getIsSelected: () => boolean;
                  getToggleSelectedHandler: () => (event: unknown) => void;
                  original: Employee;
                };
              }) => (
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
          }
          if (status === "Pending") {
            return (
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
                <span className="size-1.5 rounded-full bg-orange-600" />
                Pending
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full select-none">
              <span className="size-1.5 rounded-full bg-gray-500" />
              Suspended
            </span>
          );
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
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingEmployee(row.original);
                setIsEditModalOpen(true);
              }}
              aria-label={`Edit ${row.original.name}`}
              className="flex items-center justify-center size-9 rounded-lg text-gray-400 hover:text-green-600 hover:bg-gray-100 transition-colors"
            >
              <Edit className="size-4" />
            </button>
            <a
              href={`tel:${row.original.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center size-9 rounded-lg text-gray-400 hover:text-green-600 hover:bg-gray-100 transition-colors"
              aria-label={`Call ${row.original.name}`}
            >
              <Phone className="size-4" />
            </a>
          </div>
        ),
        size: 56,
      },
    ],
    [showViewAll],
  );

  const handleAddEmployee = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    monthlySalary: number;
    sendInvitation: boolean;
  }) => {
    try {
      const { data } = await createEmployee.mutateAsync({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        monthlySalary: payload.monthlySalary,
        sendInvitation: payload.sendInvitation,
      });
      const employee = mapEmployeeResponse(data);
      setIsAddModalOpen(false);
      onAddEmployee?.(employee);
      toast.success(`${employee.name} has been added to your team.`);
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleImportCSV = async (file: File) => {
    try {
      const result = await importEmployees.mutateAsync({ file });
      const { imported, skipped, errors } = result.data;
      setIsImportModalOpen(false);
      if (errors.length > 0) {
        toast.warning(
          `Imported ${imported} employees. ${skipped} skipped. ${errors[0].message}`,
        );
      } else {
        toast.success(`Imported ${imported} employees successfully.`);
      }
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadAuthenticatedFile(
        "/api/v1/employees/import/template",
        "klare-employee-template.csv",
      );
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const pageCount = isControlled
    ? Math.max(1, Math.ceil(filteredData.length / pagination.pageSize))
    : (employeesQuery.data?.data.totalPages ?? 1);

  const { table, tableElement } = DataTable<Employee>({
    columns,
    data: isControlled ? filteredData : employees,
    pagination,
    onPaginationChange: setPagination,
    pageCount: isControlled ? undefined : pageCount,
    manualPagination: !isControlled,
    ...(showViewAll
      ? {}
      : {
          rowSelection,
          onRowSelectionChange: setRowSelection,
        }),
    getRowId: (row) => row.id,
    emptyMessage: isLoading
      ? "Loading team members..."
      : "No team members found matching your filters.",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mt-2 select-none">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {showViewAll ? title : ""}
          </h3>
          {!showViewAll && (
            <p className="text-sm text-gray-500 mt-0.5">
              {totalCount} people · {activeCount} active on payroll
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {showViewAll ? (
            <Link
              href="/dashboard/team"
              onClick={onViewAll}
              className="text-sm font-semibold text-green-600 hover:underline flex items-center gap-1 group"
            >
              <span>View all {totalCount}</span>
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setIsImportModalOpen(true)}
                disabled={Boolean(importEmployees.isPending)}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-50"
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

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border-b border-gray-100 select-none">
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
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
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
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-black text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                },
              )}
            </div>

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

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: showViewAll ? 5 : 10 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-1/2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 max-w-[60%]" />
                    <Skeleton className="h-3 max-w-[40%]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          tableElement
        )}

        {!showViewAll && (
          <TablePagination
            table={table}
            totalItems={totalCount}
            itemLabel="employees"
          />
        )}
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
        isSubmitting={createEmployee.isPending}
      />
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        initial={editingEmployee}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onUpdate={async (payload) => {
          try {
            const { data } = await updateEmployee.mutateAsync({
              employeeId: payload.id,
              payload: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                phone: payload.phone,
                role: payload.role,
                monthlySalary: payload.monthlySalary,
                status:
                  (employeeStatusToApi(payload.status) as any) || "ACTIVE",
              },
            });
            setIsEditModalOpen(false);
            setEditingEmployee(null);
            toast.success(`${payload.firstName} ${payload.lastName} updated.`);
          } catch (error) {
            toast.error(getApiError(error));
          }
        }}
        isSubmitting={updateEmployee.isPending}
      />
      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCSV}
        onDownloadTemplate={handleDownloadTemplate}
        isSubmitting={importEmployees.isPending}
      />
    </div>
  );
}
