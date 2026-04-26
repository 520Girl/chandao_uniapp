/**
 * 用户协议与隐私政策页的路由约定：
 * - `?source=login`：自登录 `navigateTo` 进入，可返回；点「我已阅读并同意」写 Storage 并 `back` 勾选协议。
 * - `?source=home`：自首页 `reLaunch` 进入，不保留首页在栈，返回/同意走 `switchTab` 到共修，避免回首页 tab。
 */
export const STORAGE_LOGIN_AGREEMENT_CHECKED = "LOGIN_AGREEMENT_PRE_CHECK";

type AgreementPage = "user" | "privacy";

function pathFor(t: AgreementPage) {
  return t === "user" ? "/pages/profile/userAgent" : "/pages/profile/privacyPolicy";
}

/** 登录页：保留登录栈，协议页可返回；点「我已阅读并同意」写 Storage 后返回并勾选 */
export function navigateToAgreementFromLogin(t: AgreementPage) {
  uni.navigateTo({ url: `${pathFor(t)}?source=login` });
}

/** 首页：关闭 tab 栈再打开协议，侧滑/返回不会回到首页；协议页顶栏与按钮跳转到非首页 tab */
export function reLaunchAgreementFromHome(t: AgreementPage) {
  uni.reLaunch({ url: `${pathFor(t)}?source=home` });
}
