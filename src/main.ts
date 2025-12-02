import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from "./stores";

// 导入 Tailwind CSS
import "./style.css";
// 导入主题样式
import "./assets/styles/theme.scss";
// 导入主题系统
import { initTheme } from "./composables/useTheme";

export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);

  // 初始化主题
  initTheme();

  return {
    app,
  };
}
