import type { SecurityRuntimeConfig } from "./security";

export interface AppConfig {
  appName?: string;
  baseURL: string;
  apiVersion: string;
  timeout: number;
  uploadURL: string;
  title: string;
  debug: boolean;
  mode: string;
  domainWhitelist: string[];
  security: SecurityRuntimeConfig;
}



// 🔥 定义自定义请求错误接口 (解决TS报错核心)
export interface RequestError extends Error {
  statusCode?: number
  code?: number
  data?: any
}
