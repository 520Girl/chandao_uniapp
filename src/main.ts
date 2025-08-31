import { createSSRApp } from "vue";
import App from "./App.vue";

// 导入 Tailwind CSS
import "./style.css";

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
