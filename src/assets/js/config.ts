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

function parseUrlSafe(urlStr: string): { hostname: string; host: string } | null {
    // 首选标准 URL 对象
    if (typeof URL !== 'undefined') {
        try {
            const u = new URL(urlStr);
            return { hostname: u.hostname, host: u.host };
        } catch (e) {
            // 解析失败，继续备用路由
        }
    }

    // H5 环境可用 a 标签解析
    if (typeof document !== 'undefined' && document.createElement) {
        try {
            const a = document.createElement('a');
            a.href = urlStr;
            return { hostname: a.hostname || '', host: a.host || '' };
        } catch (e) {
            // continue
        }
    }

    // 兼容小程序：正则简单提取 host
    const match = urlStr.match(/^https?:\/\/([^\/\?#]+)([\/\?#]|$)/i);
    if (match) {
        return { hostname: match[1].toLowerCase(), host: match[1].toLowerCase() };
    }

    return null;
}

function normalizeDomain(input: string): string {
    const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    const parsed = parseUrlSafe(withProtocol);
    if (parsed && parsed.hostname) {
        return parsed.hostname.toLowerCase();
    }
    return input.toLowerCase();
}

function parseWhitelist(raw: string | undefined): string[] {
    console.log('原始域名白名单字符串:', raw,  parseList(raw).map(normalizeDomain));
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
    const appName = import.meta.env.VITE_APP_NAME || '';
    const mode = import.meta.env.MODE;
    const isDev = import.meta.env.DEV;
    const baseURL = getBaseURL();
    let apiVersion = '';
    // #ifdef MP-WEIXIN
    if(mode == 'development') {
        console.log('development---------------');
        apiVersion = '';  
    }else{
        apiVersion = import.meta.env.VITE_API_VERSION || '';
    }
    // #endif
    // #ifndef MP-WEIXIN
     apiVersion = import.meta.env.VITE_API_VERSION || '';
    // #endif
    const timeout = Number(import.meta.env.VITE_API_TIMEOUT || '20000');
    const uploadURL = import.meta.env.VITE_UPLOAD_BASE_URL || baseURL;
    const title = import.meta.env.VITE_APP_TITLE || 'uni-app-template';
    const securityEnable = parseBoolean(import.meta.env.VITE_SECURITY_ENABLE, false);
    const securitySecretKey = import.meta.env.VITE_SECURITY_SECRET_KEY || 'CHANGE_ME_TEMPLATE_KEY';
    const securityMethods = parseList(import.meta.env.VITE_SECURITY_ENCRYPT_METHODS || 'POST,PUT,PATCH,DELETE')
        .map((item) => item.toUpperCase());
    const domainWhitelist = parseWhitelist(import.meta.env.VITE_API_DOMAIN_WHITELIST);
    
    console.log('当前环境:', isDev ? '开发环境' : '生产环境');
    console.log('当前模式:', mode,import.meta.env.VITE_API_VERSION);

    const config: AppConfig = {
        appName,
        baseURL,
        apiVersion,
        timeout,
        uploadURL,
        mode,
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
    appName: config.appName,
    mode: config.mode,
    isDev: import.meta.env.DEV,
    isTest: import.meta.env.MODE === 'test',
    isProd: import.meta.env.PROD,
    baseURL: config.baseURL,
    apiURL: config.baseURL + config.apiVersion,
    uploadURL: config.uploadURL,
    timeout: config.timeout,
    title: config.title,
    debug: config.debug, // 区分开发环境和生产环境的标志
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
        const parsed = parseUrlSafe(url);
        console.log('解析请求URL:', url, parsed);
        if (!parsed || !parsed.hostname) {
            throw new Error('URL解析失败');
        }
        const host = parsed.hostname;
        return config.domainWhitelist.some((allowedHost) => {
            const normalized = allowedHost;
            return host === normalized || host.endsWith(`.${normalized}`);
        });
    } catch (error) {
        console.error('解析请求URL失败:', error);
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
    console.log('应用名称:', env.appName);
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
    SUCCESS: 1000,
    FAILED: 1001
} 