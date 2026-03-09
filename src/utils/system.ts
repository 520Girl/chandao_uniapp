type DeviceType = "APP" | "H5" | "MP-WEIXIN" | string;

const SYSTEM_INFO = uni.getSystemInfoSync();

// 获取状态栏高度
export function getStatusBarHeight(): number {
  return SYSTEM_INFO.statusBarHeight || 0;
}

// 获取胶囊按钮高度
export function getTitleBarHeight(): number {
  if (uni.getMenuButtonBoundingClientRect) {
    const { top, height } = uni.getMenuButtonBoundingClientRect();
    // 标题栏高度：让标题与胶囊按钮上下边距一致
    const navbarHeight = (top - getStatusBarHeight()) * 2 + height;
    return navbarHeight;
  }
  return 70;
}

/**
 * 获取状态栏和胶囊按钮总高度
 */
export const getNavbarHeight = (): number => getStatusBarHeight() + getTitleBarHeight();

/**
 * 抖音小程序下 title 左侧 logo 占位
 */
export const getTitleLogo = (): number => {
  // #ifdef MP-TOUTIAO
  const ttClient = (globalThis as any).tt;
  const {
    leftIcon: { left, width }
  } = ttClient.getCustomButtonBoundingClientRect();
  return left + width + 5;
  // #endif

  // #ifndef MP-TOUTIAO
  return 0;
  // #endif
};

/**
 * 获取底部安全距离（可用于 tabbar 额外内边距）
 */
export const getSafeBottomHeight = (): number => {
  console.log("屏幕高度:", SYSTEM_INFO.screenHeight);
  console.log("窗口高度:", SYSTEM_INFO.windowHeight);
  console.log("底部安全高度:", SYSTEM_INFO);
  return SYSTEM_INFO.safeAreaInsets?.bottom || 0;
};

/**
 * 获取设备类型
 */
export const getDeviceType = (): DeviceType => {
  // #ifdef APP-PLUS
  return "APP";
  // #endif
  // #ifdef H5
  return "H5";
  // #endif
  // #ifdef MP-WEIXIN
  return "MP-WEIXIN";
  // #endif

  return (SYSTEM_INFO as any).uniPlatform || "";
};
