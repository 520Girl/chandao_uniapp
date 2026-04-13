/**
 * 轻提示封装：对齐各端表现，重点处理微信小程序对 `showToast` 的限制。
 */

/** 微信文档约定标题不宜过长；超出易导致 success 图标不显示或表现异常 */
const MP_WEIXIN_TOAST_TITLE_MAX = 7;

function getUniPlatform(): string {
  try {
    return uni.getSystemInfoSync().uniPlatform || "";
  } catch {
    return "";
  }
}

/**
 * 按平台截断文案（仅微信小程序截断为最多 7 个 Unicode 字符）。
 * @param title 原始标题
 */
export function clipToastTitle(title: string): string {
  const t = title.trim();
  if (getUniPlatform() !== "mp-weixin") return t;
  const chars = Array.from(t);
  if (chars.length <= MP_WEIXIN_TOAST_TITLE_MAX) return t;
  return chars.slice(0, MP_WEIXIN_TOAST_TITLE_MAX).join("");
}

/**
 * 成功类提示：固定 `icon: 'success'`，时长略长于默认，便于小程序上看清对勾。
 * @param title 提示文案（微信端过长会自动截断）
 * @param duration 毫秒，默认 2000
 */
export function showSuccessToast(title: string, duration = 2000): void {
  uni.showToast({
    title: clipToastTitle(title),
    icon: "success",
    duration,
  });
}

/**
 * 无图标提示（错误、说明类）；不受 7 字截断，但若仍不显示可缩短文案。
 */
export function showToastNone(title: string, duration = 2000): void {
  uni.showToast({
    title: title.trim(),
    icon: "none",
    duration,
  });
}
