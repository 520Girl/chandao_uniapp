/**
 * 游客体验模式：无 token 时仍允许访问的接口路径（子串匹配完整 request URL）。
 * 与 `docs/app-api.md` 及登录链路对齐；其余请求在 `request` 层短路。
 */
const GUEST_ALLOWED_URL_SUBSTRINGS = [
  "/app/activity/serverTime",
  "/app/user/login/password",
  "/app/user/login/mini",
  "/app/user/login/refreshToken",
  "/app/base/comm/uploadMode",
] as const;

export function isGuestPublicApiUrl(fullUrl: string): boolean {
  const u = String(fullUrl || "");
  return GUEST_ALLOWED_URL_SUBSTRINGS.some((s) => u.includes(s));
}

/** 挂载在 Error 上，供 `request` 错误处理识别，避免 reLaunch 登录页 */
export const GUEST_BLOCKED_FLAG = "__guestBlocked";

export function createGuestBlockedError(message = "体验模式下请登录后使用完整功能"): Error & { [GUEST_BLOCKED_FLAG]?: boolean } {
  const err = new Error(message) as Error & { [GUEST_BLOCKED_FLAG]?: boolean };
  err[GUEST_BLOCKED_FLAG] = true;
  return err;
}

export function isGuestBlockedError(err: unknown): boolean {
  return Boolean(err && typeof err === "object" && (err as Record<string, unknown>)[GUEST_BLOCKED_FLAG] === true);
}
