import axios, { AxiosRequestConfig } from "axios";
import { AUTH_REQUIRED_EVENT } from "@/lib/auth-events";

// Extend AxiosRequestConfig to include custom properties
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthModal?: boolean;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  // CRITICAL: browser phải gửi httpOnly cookie trong cross-origin request
  withCredentials: true,
});

const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;

// ── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => config);

// ── Response interceptor — Silent Refresh ─────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 1. Handle Token Expiration (401)
    if (
      error.response?.status === STATUS_UNAUTHORIZED &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/v1/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/api/v1/auth/refresh");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError);

        const axiosRefreshError = refreshError as { response?: { status?: number } };
        const isAuthError =
          axiosRefreshError?.response?.status === STATUS_BAD_REQUEST ||
          axiosRefreshError?.response?.status === STATUS_UNAUTHORIZED;

        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isAuthPage =
            path === "/auth/login" || path === "/auth/register" || path.startsWith("/auth/");

          if (!isAuthPage && isAuthError) {
            if (originalRequest.skipAuthModal) {
              window.location.href = "/auth/login";
            } else {
              window.dispatchEvent(
                new CustomEvent(AUTH_REQUIRED_EVENT, {
                  detail: {
                    message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại để tiếp tục.",
                  },
                }),
              );
            }
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 2. Handle Global Security Events (Account Locked)
    const data = error.response?.data;
    if (typeof data === "object" && data !== null && "code" in data) {
      if (data.code === "AUTH_001") {
        // ACCOUNT_LOCKED
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ACCOUNT_LOCKED_EVENT"));
        }
        // Block further execution by returning a pending promise
        return new Promise(() => {});
      }
    }

    // 3. Fallback: Reject all other errors to be handled by the caller
    return Promise.reject(error);
  },
);
