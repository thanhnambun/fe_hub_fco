import axios, { AxiosRequestConfig } from "axios";

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

// ── Request interceptor ───────────────────────────────────────────────────────
// Không cần đọc localStorage nữa — cookie được browser tự gửi
apiClient.interceptors.request.use((config) => config);

// ── Response interceptor — Silent Refresh ─────────────────────────────────────
let isRefreshing = false;
// Hàng đợi các request bị chặn trong khi đang refresh token
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

    // Nếu nhận 401 và chưa retry và không phải chính endpoint refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/v1/auth/refresh")
    ) {
      if (isRefreshing) {
        // Đang có refresh khác chạy — xếp hàng chờ
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
      } catch (refreshError: any) {
        processQueue(refreshError);
        
        // Nếu lỗi 400 (thường là do thiếu Cookie) hoặc 401 (Token hết hạn thực sự)
        // QUAN TRỌNG: Axios error không expose .status trực tiếp — phải dùng .response?.status
        const isAuthError = refreshError?.response?.status === 400 || refreshError?.response?.status === 401;

        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isAuthPage = path === "/auth/login" || path === "/auth/register" || path.startsWith("/auth/");
          
          if (!isAuthPage && isAuthError) {
            if (originalRequest.skipAuthModal) {
              window.location.href = "/auth/login";
            } else {
              window.dispatchEvent(
                new CustomEvent("AUTH_REQUIRED", {
                  detail: { message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại để tiếp tục." },
                })
              );
            }
          }
        }
        return Promise.reject(buildApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(buildApiError(error));
  }
);


function buildApiError(error: unknown) {
  const axiosErr = error as {
    response?: { data?: { message?: string; data?: unknown }; status?: number };
    message?: string;
  };
  const responseData = axiosErr?.response?.data;
  const message = responseData?.message || axiosErr?.message || "Đã có lỗi xảy ra";
  const errors = responseData?.data;

  console.error("API Error:", { message, errors });

  return {
    message,
    errors: errors && typeof errors === "object" ? errors : null,
    status: axiosErr?.response?.status,
  };
}
