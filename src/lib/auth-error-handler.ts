import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiClientError, isApiErrorResponse } from "@/types/api-error";
import { ACCOUNT_LOCKED_EVENT } from "@/components/locked-account-modal";

/**
 * Standardized error handler for all auth-related requests.
 * Maps backend error codes to frontend actions (toasts, modals, redirects).
 */
export function handleAuthError(error: unknown): ApiClientError {
  // 1. Map AxiosError to standardized ApiClientError
  const apiError = parseAxiosError(error);

  // 2. Perform centralized side effects based on ErrorCode
  switch (apiError.code) {
    case "AUTH_001": // ACCOUNT_LOCKED
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(ACCOUNT_LOCKED_EVENT));
      }
      break;

    case "AUTH_002": // INVALID_CREDENTIALS
      toast.error(apiError.message, {
        description: "Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu.",
      });
      break;

    case "SYST_001": // SYSTEM_ERROR
      toast.error("Lỗi hệ thống", {
        description: apiError.message,
      });
      break;

    default:
      if (apiError.status >= 500) {
        toast.error("Lỗi máy chủ", {
          description: "Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.",
        });
      }
  }

  return apiError;
}

function parseAxiosError(error: unknown): ApiClientError {
  if (error instanceof AxiosError && error.response) {
    const data = error.response.data;
    if (isApiErrorResponse(data)) {
      return {
        code: data.code,
        message: data.message,
        status: error.response.status,
        details: data.details,
      };
    }
  }

  // Fallback for network errors or unknown formats
  return {
    code: "SYST_001",
    message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    status: axios.isAxiosError(error) ? error.response?.status || 500 : 500,
  };
}
