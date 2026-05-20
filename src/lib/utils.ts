import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  return (error as Error)?.message || fallback;
}
