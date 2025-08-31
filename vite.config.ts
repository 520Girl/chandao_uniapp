import { defineConfig } from "vite";
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from "weapp-tailwindcss/vite";

import uni from "@dcloudio/vite-plugin-uni";

import AutoImport from "unplugin-auto-import/vite";
import path from "path";

const ish5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uvwt({
      rem2rpx: true, // 是否将 rem 转换为 rpx，默认为 true 默认图纸为750px，1rpx = 0.01rem
      disabled: false, // 所有平台都启用转换 当disabled: ish5 || isApp, // 不转化的
    }),
    AutoImport({
      imports: [
        "vue", 'uni-app',
      ],
      dts: "src/types/auto-imports.d.ts",
      eslintrc: { enabled: false },
    }),
    uni(),
  ],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@assets/styles/variable" as *; @use "@assets/styles/mixin" as *; @use "@assets/styles/bem" as *; @use "@assets/styles/common" as *;`,
      },
    },
    postcss: {
      plugins: [
        require('tailwindcss')({}),
        require('autoprefixer')({})
      ],
    },
  }
});
