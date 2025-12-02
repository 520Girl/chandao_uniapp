import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from "./stores";
import uviewPlus from 'uview-plus';

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
