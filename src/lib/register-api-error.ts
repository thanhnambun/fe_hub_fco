import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/** Field đăng ký mà backend có thể trả lỗi validation — khớp RegisterRequest / form. */
export const REGISTER_FIELD_KEYS = ["fullName", "username", "email", "phone", "password"] as const;

export type RegisterServerFieldKey = (typeof REGISTER_FIELD_KEYS)[number];

export function isRegisterServerFieldKey(key: string): key is RegisterServerFieldKey {
  return (REGISTER_FIELD_KEYS as readonly string[]).includes(key);
}

export type RegisterFieldErrors = Record<string, string>;

export function extractRegisterFieldErrors(err: unknown): RegisterFieldErrors | null {
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: unknown } }).response;
    const data = response?.data;
    if (data && typeof data === "object") {
      const errors = (data as { errors?: Record<string, unknown> }).errors;
      if (errors && typeof errors === "object") {
        const result: RegisterFieldErrors = {};
        for (const [key, value] of Object.entries(errors)) {
          result[key] = String(value);
        }
        return result;
      }
    }
  }
  return null;
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
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { data?: unknown } }).response;
    const data = response?.data;
    if (data && typeof data === "object") {
      // 1. Try to extract specific field errors
      const errors = (data as { errors?: Record<string, unknown> }).errors;
      if (errors && typeof errors === "object") {
        const fieldErrors = Object.values(errors);
        if (fieldErrors.length > 0) {
          return String(fieldErrors[0]);
        }
      }
      // 2. Try to extract general detail
      const detail = (data as { detail?: string }).detail;
      if (detail) return detail;

      // 3. Try to extract legacy message
      const message = (data as { message?: string }).message;
      if (message) return message;
    }
  }

  if (err instanceof Error && err.message.length > 0) {
    return err.message;
  }
  return fallback;
}
