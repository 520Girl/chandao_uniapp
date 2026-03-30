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
