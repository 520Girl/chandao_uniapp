import type { SecurityRuntimeConfig } from "./security";

export interface AppConfig {
  baseURL: string;
  apiVersion: string;
  timeout: number;
  uploadURL: string;
  title: string;
  debug: boolean;
  domainWhitelist: string[];
  security: SecurityRuntimeConfig;
}
