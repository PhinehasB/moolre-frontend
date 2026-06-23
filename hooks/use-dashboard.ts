import { api, idempotentRequestConfig } from "@/lib/api";
import type { ApiResponse } from "@/lib/auth-types";
import type {
  ChangePasswordRequest,
  ConfirmPayrollRequest,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  DashboardSummaryResponse,
  EmployeeResponse,
  EmployeeStatsResponse,
  FundWalletRequest,
  FundingResponse,
  ImportResultResponse,
  LedgerEntry,
  PageResponse,
  PayrollInitiationResponse,
  PayrollOverviewResponse,
  PayrollRunResponse,
  ReportsOverviewResponse,
  SettingsResponse,
  SubmitFundingOtpRequest,
  TransactionFilter,
  UpdateCompanyProfileRequest,
  UpdatePayrollAutomationRequest,
  WalletResponse,
} from "@/lib/dashboard-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const dashboardKeys = {
  summary: ["dashboard", "summary"] as const,
  employees: (params: EmployeesQueryParams) => ["employees", params] as const,
  employeeStats: ["employees", "stats"] as const,
  wallet: ["wallet"] as const,
  transactions: (params: TransactionsQueryParams) =>
    ["transactions", params] as const,
  payroll: ["payroll"] as const,
  reports: ["reports"] as const,
  settings: ["settings"] as const,
};

type EmployeesQueryParams = {
  q?: string;
  status?: string;
  page?: number;
  size?: number;
};

type TransactionsQueryParams = {
  filter?: TransactionFilter;
  q?: string;
  page?: number;
  size?: number;
};

function invalidateDashboardData(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
  queryClient.invalidateQueries({ queryKey: ["employees"] });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.wallet });
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.payroll });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.reports });
}

export function useDashboardSummary() {
  return useQuery<ApiResponse<DashboardSummaryResponse>, AxiosError>({
    queryKey: dashboardKeys.summary,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardSummaryResponse>>(
        "/api/v1/dashboard/summary",
      );
      return data;
    },
    staleTime: 1000 * 60,
  });
}

export function useEmployees(
  params: EmployeesQueryParams = {},
  options?: { enabled?: boolean },
) {
  return useQuery<ApiResponse<PageResponse<EmployeeResponse>>, AxiosError>({
    queryKey: dashboardKeys.employees(params),
    queryFn: async () => {
      const { data } = await api.get<
        ApiResponse<PageResponse<EmployeeResponse>>
      >("/api/v1/employees", { params });
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useEmployeeStats(options?: { enabled?: boolean }) {
  return useQuery<ApiResponse<EmployeeStatsResponse>, AxiosError>({
    queryKey: dashboardKeys.employeeStats,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EmployeeStatsResponse>>(
        "/api/v1/employees/stats",
      );
      return data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<EmployeeResponse>,
    AxiosError,
    CreateEmployeeRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<EmployeeResponse>>(
        "/api/v1/employees",
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => invalidateDashboardData(queryClient),
  });
}

export function useImportEmployees() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ImportResultResponse>,
    AxiosError,
    { file: File; sendInvitations?: boolean }
  >({
    mutationFn: async ({ file, sendInvitations = true }) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<ApiResponse<ImportResultResponse>>(
        `/api/v1/employees/import?sendInvitations=${sendInvitations}`,
        formData,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => invalidateDashboardData(queryClient),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<EmployeeResponse>,
    AxiosError,
    { employeeId: string; payload: UpdateEmployeeRequest }
  >({
    mutationFn: async ({ employeeId, payload }) => {
      const { data } = await api.put<ApiResponse<EmployeeResponse>>(
        `/api/v1/employees/${employeeId}`,
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => invalidateDashboardData(queryClient),
  });
}

export function useWallet() {
  return useQuery<ApiResponse<WalletResponse>, AxiosError>({
    queryKey: dashboardKeys.wallet,
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<WalletResponse>>("/api/v1/wallet");
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useFundWallet() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<FundingResponse>,
    AxiosError,
    FundWalletRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<FundingResponse>>(
        "/api/v1/wallet/fund",
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.wallet });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useSubmitFundingOtp(externalRef: string | null) {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<FundingResponse>,
    AxiosError,
    SubmitFundingOtpRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<FundingResponse>>(
        `/api/v1/wallet/fund/${externalRef}/otp`,
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.wallet });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useTransactions(params: TransactionsQueryParams = {}) {
  return useQuery<ApiResponse<PageResponse<LedgerEntry>>, AxiosError>({
    queryKey: dashboardKeys.transactions(params),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<LedgerEntry>>>(
        "/api/v1/transactions",
        { params },
      );
      return data;
    },
  });
}

export function usePayrollOverview() {
  return useQuery<ApiResponse<PayrollOverviewResponse>, AxiosError>({
    queryKey: dashboardKeys.payroll,
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<PayrollOverviewResponse>>("/api/v1/payroll");
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useInitiatePayroll() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<PayrollInitiationResponse>, AxiosError, void>({
    mutationFn: async () => {
      const { data } = await api.post<ApiResponse<PayrollInitiationResponse>>(
        "/api/v1/payroll/runs/initiate",
        undefined,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.payroll });
    },
  });
}

export function useConfirmPayroll(runId: string | null) {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<PayrollRunResponse>,
    AxiosError,
    ConfirmPayrollRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<PayrollRunResponse>>(
        `/api/v1/payroll/runs/${runId}/confirm`,
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => invalidateDashboardData(queryClient),
  });
}

export function useReportsOverview() {
  return useQuery<ApiResponse<ReportsOverviewResponse>, AxiosError>({
    queryKey: dashboardKeys.reports,
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<ReportsOverviewResponse>>("/api/v1/reports");
      return data;
    },
    staleTime: 1000 * 60,
  });
}

export function useSettings() {
  return useQuery<ApiResponse<SettingsResponse>, AxiosError>({
    queryKey: dashboardKeys.settings,
    queryFn: async () => {
      const { data } =
        await api.get<ApiResponse<SettingsResponse>>("/api/v1/settings");
      return data;
    },
  });
}

export function useUpdatePayrollAutomation() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<SettingsResponse>,
    AxiosError,
    UpdatePayrollAutomationRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.put<ApiResponse<SettingsResponse>>(
        "/api/v1/settings/payroll-automation",
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.settings });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.payroll });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.summary });
    },
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<SettingsResponse>,
    AxiosError,
    UpdateCompanyProfileRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.put<ApiResponse<SettingsResponse>>(
        "/api/v1/settings/company-profile",
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.settings });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useChangePassword() {
  return useMutation<
    ApiResponse<{ message: string }>,
    AxiosError,
    ChangePasswordRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<{ message: string }>>(
        "/api/v1/settings/change-password",
        payload,
        idempotentRequestConfig(),
      );
      return data;
    },
  });
}
