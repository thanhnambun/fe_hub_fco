import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, unknown>;
      detail?: string;
      message?: string;
    };
  };
}

export function getErrorMessage(error: unknown, fallback = "Thao tác thất bại"): string {
  const data = (error as AxiosErrorResponse)?.response?.data;
  if (data) {
    if (data.errors && typeof data.errors === "object") {
      const fieldErrors = Object.values(data.errors);
      if (fieldErrors.length > 0) return String(fieldErrors[0]);
    }
    if (data.detail) return data.detail;
    if (data.message) return data.message;
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.";
    }
    const status = error.response.status;
    if (status >= 500) {
      return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
    }
    if (status === 404) {
      return "Không tìm thấy tài nguyên yêu cầu.";
    }
    if (status === 403) {
      return "Bạn không có quyền thực hiện thao tác này.";
    }
    if (status === 401) {
      return "Vui lòng đăng nhập để tiếp tục.";
    }
  }

  const msg = (error as Error)?.message;
  if (msg && !msg.includes("Request failed") && msg !== "Network Error") {
    return msg;
  }
  return fallback;
}
