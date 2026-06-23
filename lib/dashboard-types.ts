import type { ApiResponse } from "@/lib/auth-types";

export type EmployeeStatus = "PENDING" | "ACTIVE" | "SUSPENDED";
export type WalletLinkStatus = "PROVISIONING" | "LINKED" | "UNLINKED";
export type TransactionFilter = "ALL" | "INFLOWS" | "PAYOUTS" | "FAILED";
export type FundingStatus =
  | "AWAITING_OTP"
  | "AWAITING_APPROVAL"
  | "SUCCESS"
  | "FAILED";
export type PayrollRunStatus =
  | "PENDING_CONFIRMATION"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "FAILED";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface EmployeeResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  monthlySalary: number;
  status: EmployeeStatus;
  walletStatus: WalletLinkStatus;
  createdAt: string;
}

export interface EmployeeStatsResponse {
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  monthlySalary: number;
  sendInvitation?: boolean;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  monthlySalary: number;
  status: EmployeeStatus;
}

export interface ImportResultResponse {
  totalRows: number;
  imported: number;
  skipped: number;
  errors: { row: number; email: string; message: string }[];
}

export interface LedgerEntry {
  date: string;
  description: string;
  reference: string;
  status: string;
  direction: string;
  amount: number;
}

export interface WalletResponse {
  balance: number;
  pending: number;
  currency: string;
  companyName: string;
  settlementAccountMasked: string;
  bankTopUp: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  ledger: LedgerEntry[];
}

export interface FundWalletRequest {
  payer: string;
  amount: number;
}

export interface FundingResponse {
  externalRef: string;
  status: FundingStatus;
  amount: number;
  payer: string;
  otpRequired: boolean;
  message: string;
}

export interface SubmitFundingOtpRequest {
  otpcode: string;
}

export interface PayrollRunResponse {
  id: string;
  period: string;
  periodYear: number;
  periodMonth: number;
  runDate: string;
  employees: number;
  successRate: number;
  totalPaid: number;
  status: PayrollRunStatus;
}

export interface PayrollOverviewResponse {
  run: {
    activeEmployees: number;
    totalToPay: number;
    walletBalance: number;
    coveragePercent: number;
    walletCoversInFull: boolean;
    shortfall: number;
  };
  schedule: {
    automaticPayroll: boolean;
    payDate: number;
    notifyEmployeesBeforePayday: boolean;
    notifyLeadDays: number;
    status: string;
  };
  history: PayrollRunResponse[];
}

export interface PayrollInitiationResponse {
  runId: string;
  employeeCount: number;
  totalAmount: number;
  walletBalance: number;
  maskedPhone: string;
  codeExpiresAt: string;
}

export interface ConfirmPayrollRequest {
  code: string;
}

export interface DashboardSummaryResponse {
  greeting: { firstName: string; companyName: string };
  wallet: { balance: number; pending: number; currency: string };
  nextPayroll: {
    date: string;
    inDays: number;
    autoEnabled: boolean;
    activeEmployees: number;
    totalToPay: number;
    walletCoversInFull: boolean;
    shortfall: number;
  };
  lastPayroll: {
    amount: number;
    date: string;
    successRate: number;
    employees: number;
  };
  stats: {
    activeEmployees: number;
    pendingOnboarding: number;
    totalEmployees: number;
    addedThisMonth: number;
    totalMonthlyPayroll: number;
  };
  team: EmployeeResponse[];
}

export interface ReportsOverviewResponse {
  stats: {
    year: number;
    totalPaid: number;
    payrollRuns: number;
    employeesPaid: number;
    reportsGenerated: number;
  };
  reports: {
    id: string;
    kind: string;
    title: string;
    period: string;
    records: string;
    formats: string[];
  }[];
}

export interface SettingsResponse {
  payrollAutomation: {
    automaticPayroll: boolean;
    payDate: number;
    emailEstimateBeforeRun: boolean;
    notifyEmployeesBeforePayday: boolean;
  };
  companyProfile: {
    companyName: string;
    registrationNumber: string;
    adminEmail: string;
  };
}

export interface UpdatePayrollAutomationRequest {
  automaticPayroll: boolean;
  payDate: number;
  emailEstimateBeforeRun: boolean;
  notifyEmployeesBeforePayday: boolean;
}

export interface UpdateCompanyProfileRequest {
  companyName: string;
  registrationNumber: string;
  adminEmail: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type DashboardApiResponse<T> = ApiResponse<T>;
