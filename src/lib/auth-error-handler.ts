import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import {
  ApiClientError,
  isApiErrorResponse,
  normalizeApiErrorBody,
  ErrorCode,
} from "@/types/api-error";
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

    case "AUTH_005": // TOKEN_BLACKLISTED / logged out
      toast.error(apiError.message, {
        description: "Phiên đăng nhập đã kết thúc.",
      });
      break;

    case "AUTH_006": // RATE_LIMITED
      toast.warning(apiError.message);
      break;

    case "CARD_001": // player card not found (detail API)
      toast.error(apiError.message);
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
      const n = normalizeApiErrorBody(data);
      return {
        code: n.code,
        message: n.message,
        status: error.response.status,
        details: n.details,
      };
    }

    // Dynamic extraction fallback for non-strict error formats
    if (data && typeof data === "object") {
      const msg =
        (data as { detail?: string; message?: string }).detail ||
        (data as { detail?: string; message?: string }).message;
      if (msg) {
        return {
          code:
            (data as { errorCode?: ErrorCode }).errorCode ||
            (error.response.status === 401 ? "AUTH_004" : "SYST_001"),
          message: msg,
          status: error.response.status,
          details: (data as { errors?: Record<string, string> }).errors,
        };
      }
    }
  }

  const status = axios.isAxiosError(error) ? error.response?.status || 500 : 500;

  // Custom message mapping for network/unknown failures
  let friendlyMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      friendlyMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền mạng.";
    } else if (status >= 500) {
      friendlyMessage = "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
    } else if (status === 404) {
      friendlyMessage = "Không tìm thấy tài nguyên yêu cầu.";
    } else if (status === 403) {
      friendlyMessage = "Bạn không có quyền truy cập tài nguyên này.";
    } else if (status === 401) {
      friendlyMessage = "Vui lòng đăng nhập để tiếp tục.";
    }
  }

  // Fallback for network errors or unknown formats
  return {
    code: status === 401 ? "AUTH_004" : "SYST_001",
    message: friendlyMessage,
    status,
  };
}
