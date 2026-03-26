const https = require('https');
const http = require('http');
const { URL } = require('url');

// 本地调试默认直连本机后端；云端运行请改用 LOGIN_API_URL（公网地址）。
const DEFAULT_LOGIN_API_URL = 'http://127.0.0.1:8001/app/user/login/mini';

function isLocalHost(hostname) {
  return hostname === '127.0.0.1' || hostname === 'localhost';
}

function isCloudRuntime() {
  return Boolean(process.env.TENCENTCLOUD_RUNENV || process.env.SCF_RUNTIME_VERSION);
}

function resolveLoginUrl() {
  const loginUrl = process.env.LOGIN_API_URL || DEFAULT_LOGIN_API_URL;

  const parsed = new URL(loginUrl);
  const allowLocal = process.env.ALLOW_LOCAL_BACKEND === 'true';
  const useLocalHost = isLocalHost(parsed.hostname);

  // 本地云函数调试可直连本机后端；云端函数禁止访问 localhost。
  if (isCloudRuntime() && useLocalHost && !allowLocal) {
    throw new Error('当前为云端运行环境，DEFAULT_LOGIN_API_URL 是本地地址；请配置 LOGIN_API_URL 为公网后端地址');
  }

  return loginUrl;
}

function requestJson(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const data = JSON.stringify(body || {});
    const isHttps = parsed.protocol === 'https:';

    const req = (isHttps ? https : http).request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: `${parsed.pathname}${parsed.search || ''}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
        timeout: 15000,
      },
      (res) => {
        let chunks = '';

        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('end', () => {
          const statusCode = res.statusCode || 500;
          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`登录接口异常，HTTP ${statusCode}`));
            return;
          }

          try {
            const parsedJson = chunks ? JSON.parse(chunks) : {};
            resolve(parsedJson);
          } catch (error) {
            reject(new Error('登录接口返回非 JSON 数据'));
          }
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('登录接口请求超时'));
    });

    req.write(data);
    req.end();
  });
}

exports.main = async (event) => {
  let loginUrl = '';
  const code = event && event.code;
  const encryptedData = event && event.encryptedData;
  const iv = event && event.iv;
  const rawData = event && event.rawData;
  const signature = event && event.signature;
  const userInfo = event && event.userInfo;

  try {
    loginUrl = resolveLoginUrl();
  } catch (error) {
    return {
      code: 0,
      message: error.message || '后端地址配置错误',
    };
  }

  console.log('[miniLogin] request target:', loginUrl);
  console.log('[miniLogin] payload keys:', Object.keys(event || {}));

  if (!code) {
    return {
      code: 0,
      message: '缺少微信登录 code',
    };
  }

  try {
    const payload = {
      code,
      encryptedData: encryptedData || '',
      iv: iv || '',
    };
    if (rawData) {
      payload.rawData = rawData;
    }
    if (signature) {
      payload.signature = signature;
    }
    if (userInfo) {
      payload.userInfo = userInfo;
    }

    console.log('[miniLogin] forward payload keys:', Object.keys(payload));

    const result = await requestJson(loginUrl, payload);
    console.log('[miniLogin] backend response keys:', Object.keys(result || {}));
    return result;
  } catch (error) {
    console.error('[miniLogin] request failed:', error);
    return {
      code: 0,
      message: error.message || '云函数登录失败',
    };
  }
};
