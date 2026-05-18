import axios, { AxiosError, AxiosResponse } from "axios";

/** Danh sách mã lỗi contract-first — đồng bộ với com.fco.platform.common.exception.ErrorCode */
export const API_ERROR_CODES = [
  "AUTH_001",
  "AUTH_002",
  "AUTH_003",
  "AUTH_004",
  "AUTH_005",
  "AUTH_006",
  "USER_001",
  "USER_002",
  "PLAY_001",
  "CARD_001",
  "MKT_001",
  "SQUAD_001",
  "REV_001",
  "CRAW_001",
  "SYNC_001",
  "VAL_001",
  "RES_001",
  "RES_002",
  "RES_003",
  "SYST_001",
] as const;

export type ErrorCode = (typeof API_ERROR_CODES)[number];

/** Legacy envelope (trước RFC 7807). */
export interface ApiErrorResponseLegacy {
  code: ErrorCode;
  message: string;
  timestamp: string;
  path: string;
  details?: Record<string, string>;
}

/** RFC 7807 + mở rộng errorCode (Spring ProblemDetail). */
export interface ApiProblemJson {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errorCode: ErrorCode;
  timestamp: string;
  errors?: Record<string, string>;
}

export type ApiErrorResponse = ApiErrorResponseLegacy | ApiProblemJson;

export interface ApiClientError {
  code: ErrorCode;
  message: string;
  status: number;
  details?: Record<string, string>;
}

function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && (API_ERROR_CODES as readonly string[]).includes(value);
}

export function isApiProblemJson(data: unknown): data is ApiProblemJson {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.type === "string" &&
    typeof d.title === "string" &&
    typeof d.status === "number" &&
    typeof d.detail === "string" &&
    typeof d.instance === "string" &&
    isErrorCode(d.errorCode) &&
    typeof d.timestamp === "string"
  );
}

export function isApiErrorResponseLegacy(data: unknown): data is ApiErrorResponseLegacy {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    isErrorCode(d.code) &&
    typeof d.message === "string" &&
    typeof d.timestamp === "string" &&
    typeof d.path === "string"
  );
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return isApiProblemJson(data) || isApiErrorResponseLegacy(data);
}

export function normalizeApiErrorBody(
  data: ApiErrorResponse,
): Pick<ApiClientError, "code" | "message" | "details"> {
  if (isApiProblemJson(data)) {
    return {
      code: data.errorCode,
      message: data.detail,
      details: data.errors,
    };
  }
  return {
    code: data.code,
    message: data.message,
    details: data.details,
  };
}

export function isAxiosApiError(
  error: unknown,
): error is AxiosError<ApiErrorResponse> & { response: AxiosResponse<ApiErrorResponse> } {
  return axios.isAxiosError(error) && !!error.response && isApiErrorResponse(error.response.data);
}
