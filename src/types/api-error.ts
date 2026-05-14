import axios, { AxiosError } from "axios";

export type ErrorCode =
  | "AUTH_001"
  | "AUTH_002"
  | "AUTH_003"
  | "AUTH_004"
  | "USER_001"
  | "USER_002"
  | "PLAY_001"
  | "SYST_001";

export interface ApiErrorResponse {
  code: ErrorCode;
  message: string;
  timestamp: string;
  path: string;
  details?: Record<string, string>;
}

export interface ApiClientError {
  code: ErrorCode;
  message: string;
  status: number;
  details?: Record<string, string>;
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.code === "string" &&
    typeof d.message === "string" &&
    typeof d.timestamp === "string" &&
    typeof d.path === "string"
  );
}

export function isAxiosApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (
    axios.isAxiosError(error) && error.response != null && isApiErrorResponse(error.response.data)
  );
}
