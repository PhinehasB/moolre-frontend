// ─── Enums (matching backend) ────────────────────────────────────────────────

export type Industry =
  | "TECHNOLOGY"
  | "RETAIL_AND_COMMERCE"
  | "FINANCIAL_SERVICES"
  | "MANUFACTURING"
  | "HOSPITALITY"
  | "OTHER";

export type PayrollBand =
  | "UNDER_10K"
  | "FROM_10K_TO_50K"
  | "FROM_50K_TO_200K"
  | "OVER_200K";

export type BusinessUserRole = "OWNER" | "ADMIN" | "HR" | "VIEWER";

export type CompanyStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface RegisterCompanyRequest {
  company: {
    name: string;
    registrationNumber: string;
    industry: Industry;
    expectedMonthlyPayroll: PayrollBand;
  };
  administrator: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };
  consents: {
    acceptedTerms: boolean;
    authorizedFundMovement: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface AuthUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: BusinessUserRole;
}

export interface CompanyResponse {
  id: string;
  name: string;
  registrationNumber?: string;
  industry: Industry;
  expectedMonthlyPayroll?: PayrollBand;
  status?: CompanyStatus;
  liveMode?: boolean;
}

export interface AuthenticationResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUserResponse;
  company: CompanyResponse;
}

export interface VerificationPendingResponse {
  email: string;
  message: string;
}

export interface MeResponse {
  user: AuthUserResponse;
  company: CompanyResponse;
}

export interface MessageResponse {
  message: string;
}

export interface RegistrationOption {
  value: string;
  label: string;
}

export interface RegistrationOptionsResponse {
  industries: RegistrationOption[];
  payrollBands: RegistrationOption[];
}

// ─── API envelope (matching backend ApiResponse) ─────────────────────────────

export interface ApiFieldViolation {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  violations?: ApiFieldViolation[];
  traceId?: string;
}

/** Generic backend envelope: { success, data, error, timestamp } */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiErrorBody | null;
  message?: string;
  timestamp?: string;
}
