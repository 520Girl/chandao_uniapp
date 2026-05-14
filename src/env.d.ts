/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_UPLOAD_BASE_URL?: string;
  readonly VITE_API_VERSION?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_API_DOMAIN_WHITELIST?: string;
  readonly VITE_SECURITY_ENABLE?: string;
  readonly VITE_SECURITY_SECRET_KEY?: string;
  readonly VITE_SECURITY_ENCRYPT_METHODS?: string;
  /** H5 分享落地根 URL（含协议、无尾斜杠），用于报告页「复制链接」与海报二维码 */
  readonly VITE_H5_SHARE_BASE?: string;
  /** 微信小程序「分享到朋友圈」默认分享图，须为 HTTPS；对应 `onShareTimeline` 返回的 `imageUrl` */
  readonly VITE_MP_TIMELINE_SHARE_IMAGE?: string;
  /**
   * 禅修后台静音切片网络地址（可选）。若设置则优先于包内 `/static/silence.mp3`。
   * 真机须 HTTPS，且域名在小程序「downloadFile 合法域名」等中配置；本机 http 仅开发者工具可测。
   */
  readonly VITE_MEDITATION_SILENCE_URL?: string;
  /**
   * 冥想报告分享海报底层背景图 URL（`up-poster` 首层 image）。
   * 小程序/H5 导出海报时需可访问；留空则使用代码内与线上一致的默认地址。
   */
  readonly VITE_MEDITATION_REPORT_POSTER_BG_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
