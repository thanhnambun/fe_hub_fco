/** Phải khớp với `CustomEvent` phát từ api-client khi cần đăng nhập lại. */
export const AUTH_REQUIRED_EVENT = "AUTH_REQUIRED" as const;

export type AuthRequiredDetail = {
  message?: string;
};

/**
 * Thu hẹp `Event` → `CustomEvent<AuthRequiredDetail>` an toàn cho TypeScript.
 * Chỉ chấp nhận khi `type` khớp và `detail` rỗng hoặc là object (payload tùy chọn).
 */
export function isAuthRequiredEvent(event: Event): event is CustomEvent<AuthRequiredDetail> {
  if (event.type !== AUTH_REQUIRED_EVENT) {
    return false;
  }
  if (!("detail" in event)) {
    return false;
  }
  const detail = (event as CustomEvent<unknown>).detail;
  if (detail === undefined || detail === null) {
    return true;
  }
  return typeof detail === "object";
}

export function getAuthRequiredMessage(
  event: CustomEvent<AuthRequiredDetail>,
  fallback: string,
): string {
  const msg = event.detail?.message;
  return typeof msg === "string" && msg.length > 0 ? msg : fallback;
}
