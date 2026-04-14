import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from "./stores";
import uviewPlus from "uview-plus";

/**
 * uview-plus 海报等组件在非 App 端使用 `uni.rpx2px`（见 `uview-plus/libs/function/index.js`）。
 * 部分 uni-app 运行时（如微信小程序）未挂载 `rpx2px`，仅有 `upx2px`，会导致 `TypeError: rpx2px is not a function`。
 */
function polyfillUniRpx2px() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = uni as any;
  if (u && typeof u.rpx2px !== "function" && typeof uni.upx2px === "function") {
    u.rpx2px = (n: number) => uni.upx2px(n);
  }
}
polyfillUniRpx2px();

// 导入 Tailwind CSS
import "./style.css";

// 导入主题系统
import { initTheme } from "./composables/useTheme";

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);
  app.use(uviewPlus, () => {
    return {
      options: {
        // 修改$u.config对象的属性
        config: {
          // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
          unit: 'rpx'
        }
      }
    }	
  });
  // 初始化主题
  initTheme();

  return {
    app,
  };
}
