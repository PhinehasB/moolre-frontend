import type { Employee, PayrollRun, Report, Transaction } from "@/interfaces/tables.interface";
import type { EmployeeResponse, LedgerEntry, PayrollRunResponse } from "@/lib/dashboard-types";
import { formatInstant, formatLocalDate, toNumber } from "@/lib/format";

const AVATAR_COLORS = [
  "bg-green-50 text-green-600",
  "bg-orange-50 text-orange-600",
  "bg-[#ede7f6] text-[#4a148c]",
  "bg-[#e3f2fd] text-[#0d47a1]",
  "bg-[#efebe9] text-[#3e2723]",
];

function avatarColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash];
}

function mapEmployeeStatus(status: EmployeeResponse["status"]): Employee["status"] {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending";
    case "SUSPENDED":
      return "Suspended";
  }
}

function mapWalletStatus(status: EmployeeResponse["walletStatus"]): Employee["wallet"] {
  return status === "LINKED" ? "Linked" : "Provisioning";
}

export function mapEmployeeResponse(employee: EmployeeResponse): Employee {
  return {
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`.trim(),
    email: employee.email,
    phone: employee.phone,
    wallet: mapWalletStatus(employee.walletStatus),
    status: mapEmployeeStatus(employee.status),
    salary: toNumber(employee.monthlySalary),
    avatarColor: avatarColorForId(employee.id),
  };
}

export function mapPayrollRun(run: PayrollRunResponse): PayrollRun {
  return {
    id: run.id,
    period: run.period,
    runDate: formatLocalDate(run.runDate),
    employees: run.employees,
    successRate: run.successRate,
    totalPaid: toNumber(run.totalPaid),
  };
}

export function mapLedgerEntry(entry: LedgerEntry, index: number): Transaction {
  const direction = entry.direction?.toUpperCase() ?? "";
  const isInflow = direction === "INFLOW" || direction === "CREDIT";
  const status = entry.status?.toUpperCase() === "FAILED" ? "Failed" : "Success";

  return {
    id: `${entry.reference || "ledger"}-${index}`,
    date: formatInstant(entry.date),
    description: entry.description,
    reference: entry.reference,
    status,
    amount: toNumber(entry.amount),
    type: isInflow ? "inflow" : "payout",
  };
}

export function mapAvailableReport(report: {
  id: string;
  kind: string;
  title: string;
  period: string;
  records: string;
  formats: string[];
}): Report {
  return {
    id: report.id,
    name: report.title,
    period: report.period,
    records: report.records,
    formats: report.formats.map((f) => f.toUpperCase()),
    kind: report.kind,
  };
}

export type ReportWithKind = Report & { kind: string };

export function employeeStatusToApi(
  status: "All" | "Active" | "Pending" | "Suspended"
): EmployeeResponse["status"] | undefined {
  switch (status) {
    case "Active":
      return "ACTIVE";
    case "Pending":
      return "PENDING";
    case "Suspended":
      return "SUSPENDED";
    default:
      return undefined;
  }
}

export function transactionFilterToApi(
  filter: "All" | "Inflows" | "Payouts" | "Failed"
): "ALL" | "INFLOWS" | "PAYOUTS" | "FAILED" {
  switch (filter) {
    case "Inflows":
      return "INFLOWS";
    case "Payouts":
      return "PAYOUTS";
    case "Failed":
      return "FAILED";
    default:
      return "ALL";
  }
}
