import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth-store";
import type { ApiResponse, AuthenticationResponse } from "@/lib/auth-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

/** Attach a stable Idempotency-Key for safe mutation retries (backend max 255 chars). */
export function idempotentRequestConfig(
  idempotencyKey: string = generateIdempotencyKey()
): AxiosRequestConfig {
  return {
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  };
}

function attachIdempotencyKey(config: InternalAxiosRequestConfig) {
  const method = config.method?.toUpperCase();
  if (!method || !MUTATING_METHODS.has(method)) return;

  const headers = config.headers ?? {};
  if (!headers["Idempotency-Key"]) {
    headers["Idempotency-Key"] = generateIdempotencyKey();
  }
  config.headers = headers;
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  attachIdempotencyKey(config);
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token!);
    }
  });
  failedQueue = [];
}

function getRetryAfterSeconds(error: AxiosError): number | undefined {
  const retryAfter = error.response?.headers?.["retry-after"];
  if (retryAfter == null) return undefined;
  const seconds = Number(retryAfter);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : undefined;
}

export function isRateLimitedError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 429;
}

export function isIdempotencyInProgressError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) return false;
  const body = error.response?.data as { error?: { code?: string } } | undefined;
  return body?.error?.code === "IDEMPOTENCY_REQUEST_IN_PROGRESS";
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const is401 =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/refresh") &&
      !originalRequest.url?.includes("/login");

    if (!is401) {
      if (isRateLimitedError(error)) {
        const retryAfter = getRetryAfterSeconds(error);
        if (retryAfter != null) {
          (error as AxiosError & { retryAfterSeconds?: number }).retryAfterSeconds =
            retryAfter;
        }
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers!.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

    if (!refreshToken) {
      clearAuth();
      processQueue(error, null);
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<ApiResponse<AuthenticationResponse>>(
        `${BASE_URL}/api/v1/auth/company/refresh`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const auth = data.data;
      setTokens({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        user: auth.user,
        company: auth.company,
      });

      originalRequest.headers!.Authorization = `Bearer ${auth.accessToken}`;
      processQueue(null, auth.accessToken);
      return api(originalRequest);
    } catch (refreshError) {
      clearAuth();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
