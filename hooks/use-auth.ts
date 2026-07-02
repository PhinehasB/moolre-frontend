import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  api,
  idempotentRequestConfig,
  isRateLimitedError,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { queryClient } from "@/lib/query-client";
import type {
  ApiErrorBody,
  ApiResponse,
  AuthenticationResponse,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  MeResponse,
  RegisterCompanyRequest,
  RegistrationOptionsResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerificationPendingResponse,
} from "@/lib/auth-types";

// Error code → professional message map

const ERROR_CODE_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS:
    "The email address or password you entered is incorrect. Please try again.",
  ACCOUNT_LOCKED:
    "Your account has been temporarily locked due to multiple failed sign-in attempts. Please wait 15 minutes and try again, or reset your password.",
  ACCOUNT_INACTIVE:
    "Your account is currently inactive. Please contact support if you believe this is a mistake.",
  EMAIL_NOT_VERIFIED:
    "Your email address has not been verified yet. Please check your inbox for the verification link.",
  CONFLICT:
    "This information conflicts with an existing record. Please review and try again.",
  RATE_LIMITED:
    "Too many requests. Please wait a moment before trying again.",
  IDEMPOTENCY_KEY_CONFLICT:
    "This action was already submitted with different details. Please refresh and try again.",
  IDEMPOTENCY_REQUEST_IN_PROGRESS:
    "Your previous request is still being processed. Please wait a moment.",
  VALIDATION_ERROR:
    "Some of the information you entered is invalid. Please review and try again.",
  UNAUTHORIZED:
    "Your session has expired. Please sign in again.",
  FORBIDDEN:
    "You do not have permission to perform this action.",
  INVALID_TOKEN:
    "This link has expired or is no longer valid. Please request a new one.",
  NOT_FOUND:
    "The requested resource could not be found.",
  INTERNAL_ERROR:
    "We're experiencing a temporary issue on our end. Please try again in a few moments.",
};

type ApiFailureBody = {
  success: false;
  error: ApiErrorBody;
};

/**
 * Reads the backend's ApiResponse envelope `{ error: { code, message, violations } }`
 * and returns a professional, user-facing error string.
 */
export function getApiError(error: unknown): string {
  if (isRateLimitedError(error)) {
    const retryAfter = (error as AxiosError & { retryAfterSeconds?: number })
      .retryAfterSeconds;
    if (retryAfter != null) {
      const seconds = Math.ceil(retryAfter);
      return seconds <= 60
        ? `Too many requests. Please wait ${seconds} second${seconds === 1 ? "" : "s"} and try again.`
        : `Too many requests. Please wait about ${Math.ceil(seconds / 60)} minute${seconds >= 120 ? "s" : ""} and try again.`;
    }
    return ERROR_CODE_MESSAGES.RATE_LIMITED;
  }

  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiFailureBody | undefined;

    if (body?.error) {
      const { code, message, violations } = body.error;

      if (violations && violations.length > 0) {
        return violations[0].message;
      }

      if (
        code === "CONFLICT" &&
        typeof message === "string" &&
        message.length > 0
      ) {
        return message;
      }

      if (code && ERROR_CODE_MESSAGES[code]) {
        return ERROR_CODE_MESSAGES[code];
      }

      if (typeof message === "string" && message.length > 0) {
        return message;
      }
    }

    if (!error.response) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    if (error.response.status >= 500) {
      return ERROR_CODE_MESSAGES.INTERNAL_ERROR;
    }
  }

  return "An unexpected error occurred. Please try again.";
}

// Registration form options (from backend)

export function useRegistrationOptions() {
  return useQuery<ApiResponse<RegistrationOptionsResponse>, AxiosError>({
    queryKey: ["registration-options"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<RegistrationOptionsResponse>>(
        "/api/v1/auth/company/registration-options"
      );
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
}

// Sign-up

export type SignUpVariables = {
  request: RegisterCompanyRequest;
  idempotencyKey?: string;
};

export function useSignUp() {
  return useMutation<
    ApiResponse<VerificationPendingResponse>,
    AxiosError,
    SignUpVariables
  >({
    mutationFn: async ({ request, idempotencyKey }) => {
      const { data } = await api.post<ApiResponse<VerificationPendingResponse>>(
        "/api/v1/auth/company/register",
        request,
        idempotentRequestConfig(idempotencyKey)
      );
      return data;
    },
  });
}

// Sign-in

export function useSignIn() {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation<
    ApiResponse<AuthenticationResponse>,
    AxiosError,
    LoginRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<AuthenticationResponse>>(
        "/api/v1/auth/company/login",
        payload
      );
      return data;
    },
    onSuccess: (res) => {
      const auth = res.data;
      setTokens({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        user: auth.user,
        company: auth.company,
      });
      queryClient.setQueryData(["me"], { data: { user: auth.user, company: auth.company } });
    },
  });
}

// Sign-out

export function useSignOut() {
  const { refreshToken, clearAuth } = useAuthStore();

  return useMutation<ApiResponse<MessageResponse>, AxiosError, void>({
    mutationFn: async () => {
      if (refreshToken) {
        const { data } = await api.post<ApiResponse<MessageResponse>>(
          "/api/v1/auth/company/logout",
          { refreshToken }
        );
        return data;
      }
      return { success: true, data: { message: "Signed out." } };
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

// Current user

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<ApiResponse<MeResponse>, AxiosError>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MeResponse>>("/api/v1/me");
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
  });
}

// Forgot password

export function useForgotPassword() {
  return useMutation<
    ApiResponse<MessageResponse>,
    AxiosError,
    ForgotPasswordRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<MessageResponse>>(
        "/api/v1/auth/company/forgot-password",
        payload
      );
      return data;
    },
  });
}

export interface UpdateModeRequest {
  live: boolean;
}

export function useSetMode() {
  return useMutation<ApiResponse<{ liveMode: boolean }>, AxiosError, UpdateModeRequest>({
    mutationFn: async (payload) => {
      const { data } = await api.put<ApiResponse<{ liveMode: boolean }>>(
        "/api/v1/settings/mode",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Reset password 

export function useResetPassword() {
  return useMutation<
    ApiResponse<MessageResponse>,
    AxiosError,
    ResetPasswordRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<MessageResponse>>(
        "/api/v1/auth/company/reset-password",
        payload
      );
      return data;
    },
  });
}

// ── Resend email verification ─────────────────────────────────────────────────

export function useResendVerification() {
  return useMutation<
    ApiResponse<MessageResponse>,
    AxiosError,
    ResendVerificationRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await api.post<ApiResponse<MessageResponse>>(
        "/api/v1/auth/company/resend-verification",
        payload
      );
      return data;
    },
  });
}

// ── Convenience hook: sign-out + redirect ─────────────────────────────────────

export function useSignOutAndRedirect() {
  const router = useRouter();
  const signOut = useSignOut();

  return () =>
    signOut.mutate(undefined, {
      onSettled: () => router.push("/signin"),
    });
}

// ── User Initials ─────────────────────────────────────────────────────────────

export function useAuthInitials() {
  const user = useAuthStore((s) => s.user);
  if (!user) return "?";
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
