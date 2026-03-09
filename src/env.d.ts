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
