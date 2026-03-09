import type { AppConfig } from '@/types/config';

function parseList(value: string | undefined): string[] {
    if (!value) return [];
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function parseBoolean(value: string | undefined, defaultValue = false): boolean {
    if (typeof value === 'undefined') return defaultValue;
    return value === 'true' || value === '1';
}

function normalizeDomain(input: string): string {
    const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    try {
        const url = new URL(withProtocol);
        return url.hostname.toLowerCase();
    } catch (error) {
        return input.toLowerCase();
    }
}

function parseWhitelist(raw: string | undefined): string[] {
    return parseList(raw).map(normalizeDomain);
}

function getBaseURL(): string {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    return '';
}

function getConfig(): AppConfig {
    console.log('=== 开始获取配置 ===');
    const mode = import.meta.env.MODE;
    const isDev = import.meta.env.DEV;
    const baseURL = getBaseURL();
    const apiVersion = import.meta.env.VITE_API_VERSION || '/api';
    const timeout = Number(import.meta.env.VITE_API_TIMEOUT || '20000');
    const uploadURL = import.meta.env.VITE_UPLOAD_BASE_URL || baseURL;
    const title = import.meta.env.VITE_APP_TITLE || 'uni-app-template';
    const securityEnable = parseBoolean(import.meta.env.VITE_SECURITY_ENABLE, false);
    const securitySecretKey = import.meta.env.VITE_SECURITY_SECRET_KEY || 'CHANGE_ME_TEMPLATE_KEY';
    const securityMethods = parseList(import.meta.env.VITE_SECURITY_ENCRYPT_METHODS || 'POST,PUT,PATCH,DELETE')
        .map((item) => item.toUpperCase());
    const domainWhitelist = parseWhitelist(import.meta.env.VITE_API_DOMAIN_WHITELIST);
    
    console.log('当前环境:', isDev ? '开发环境' : '生产环境');
    console.log('当前模式:', mode);

    const config: AppConfig = {
        baseURL,
        apiVersion,
        timeout,
        uploadURL,
        title,
        debug: isDev,
        domainWhitelist,
        security: {
            enableEncryption: securityEnable,
            secretKey: securitySecretKey,
            encryptMethods: securityMethods
        }
    };

    console.log('最终配置:', config);
    return config;
}

// 导出配置
export const config = getConfig();

// 导出环境信息
export const env = {
    isDev: import.meta.env.DEV,
    isTest: import.meta.env.MODE === 'test',
    isProd: import.meta.env.PROD,
    baseURL: config.baseURL,
    apiURL: config.baseURL + config.apiVersion,
    uploadURL: config.uploadURL,
    timeout: config.timeout,
    title: config.title,
    debug: config.debug,
    domainWhitelist: config.domainWhitelist
};

// 导出API URL构建函数
export function buildApiUrl(path: string): string {
    return `${config.baseURL}${config.apiVersion}${path}`;
}

// 导出静态资源URL构建函数
export function buildStaticUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${config.baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function isApiDomainAllowed(url: string): boolean {
    if (!config.domainWhitelist.length) return true;

    try {
        const parsed = new URL(url);
        const host = parsed.hostname.toLowerCase();
        return config.domainWhitelist.includes(host);
    } catch (error) {
        return false;
    }
}

// 导出环境检测函数
export function getCurrentEnv(): string {
    if (env.isDev) return 'development';
    if (env.isTest) return 'test';
    if (env.isProd) return 'production';
    return 'unknown';
}

// 导出调试信息
export function logEnvInfo(): void {
    console.log('=== 环境配置信息 ===');
    console.log('当前环境:', getCurrentEnv());
    console.log('当前模式:', import.meta.env.MODE);
    console.log('应用标题:', env.title);
    console.log('API基础URL:', env.baseURL);
    console.log('完整API URL:', env.apiURL);
    console.log('域名白名单:', env.domainWhitelist);
    console.log('上传URL:', env.uploadURL);
    console.log('超时时间:', env.timeout);
    console.log('调试模式:', env.debug);
    console.log('==================');
}

// 请求状态码
export const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
}
logEnvInfo()
// 业务状态码
export const BUSINESS_CODE = {
    SUCCESS: 1,
    FAIL: 0
} 