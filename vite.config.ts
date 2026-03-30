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
    uni(),
    uvwt({
      rem2rpx: true, // 是否将 rem 转换为 rpx，默认为 true 默认图纸为750px，1rpx = 0.01rem
      disabled: ish5 || isApp, // 所有平台都启用转换 当disabled: ish5 || isApp, // 不转化的
    }),
    AutoImport({
      imports: [
        "vue", 'uni-app','pinia',
        {
          '@/stores/user': ['useUserStore']
         }
        
      ],
      dts: "src/types/auto-imports.d.ts",
      eslintrc: { enabled: false },
    }),
  ],
  server:{
    proxy: {
      '/api': {
        target: 'http://192.168.31.78:8001', // 后端API服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import "@assets/styles/variable.scss";
        @import "@assets/styles/mixin.scss";
        @import "@assets/styles/bem.scss";
        @import "@assets/styles/animation.scss";
        @import "@assets/styles/common.scss";`,
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],  
      },
    },
    devSourcemap: true, // 开发环境是否启用 sourcemap
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: {
      
      plugins: [
        require('tailwindcss')({}),
        require('autoprefixer')({})
      ],
    },
  }
});
