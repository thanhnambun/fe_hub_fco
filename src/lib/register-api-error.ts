import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { isAxiosApiError } from "@/types/api-error";

/** Field đăng ký mà backend có thể trả lỗi validation — khớp RegisterRequest / form. */
export const REGISTER_FIELD_KEYS = ["fullName", "username", "email", "phone", "password"] as const;

export type RegisterServerFieldKey = (typeof REGISTER_FIELD_KEYS)[number];

export function isRegisterServerFieldKey(key: string): key is RegisterServerFieldKey {
  return (REGISTER_FIELD_KEYS as readonly string[]).includes(key);
}

export type RegisterFieldErrors = Record<string, string>;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function extractRegisterFieldErrors(err: unknown): RegisterFieldErrors | null {
  if (!isAxiosApiError(err) || !err.response?.data.details) return null;
  const details = err.response.data.details;
  if (!isRecord(details)) return null;

  // Convert Record<string, unknown> to Record<string, string>
  const errors: RegisterFieldErrors = {};
  for (const [key, value] of Object.entries(details)) {
    errors[key] = String(value);
  }
  return errors;
}

export function applyServerFieldErrors<T extends FieldValues>(
  fieldErrors: RegisterFieldErrors,
  setError: UseFormSetError<T>,
): void {
  for (const [field, message] of Object.entries(fieldErrors)) {
    if (!isRegisterServerFieldKey(field)) continue;
    setError(field as Path<T>, { type: "server", message });
  }
}

export function getRegisterErrorToastMessage(err: unknown, fallback: string): string {
  if (isAxiosApiError(err)) {
    return err.response?.data.message || fallback;
  }
  if (err instanceof Error && err.message.length > 0) {
    return err.message;
  }
  return fallback;
}
