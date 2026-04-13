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
