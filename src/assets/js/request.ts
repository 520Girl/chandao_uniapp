import { storeToRefs } from "pinia";
import { config, HTTP_STATUS, BUSINESS_CODE, isApiDomainAllowed } from "./config";
import { decryptPayload, encryptPayload, shouldEncryptRequest } from "./crypto";
import { useUserStore } from "@/stores/user";
import type { AuthTokenPayload } from "@/types/api/user";
import type { RequestError } from "@/types/config";

const REFRESH_TOKEN_PATH = "/app/user/login/refreshToken";

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

/** 并发 401 时共用的单次刷新 Promise，避免重复打刷新接口 */
let refreshInFlight: Promise<boolean> | null = null;

function refreshSessionOnce(): Promise<boolean> {
  if (refreshInFlight) {
    return refreshInFlight;
  }
  const p = (async (): Promise<boolean> => {
    try {
      const store = useUserStore();
      const rt = store.refreshToken;
      if (!rt) return false;
      const res = await post(REFRESH_TOKEN_PATH, { refreshToken: rt }, { skipAuthRefresh: true });
      const payload = res?.data as AuthTokenPayload | undefined;
      if (payload?.token) {
        store.applyAuthTokens({
          token: payload.token,
          refreshToken: payload.refreshToken ?? rt,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error("refreshSessionOnce", e);
      return false;
    }
  })();
  refreshInFlight = p;
  void p.finally(() => {
    if (refreshInFlight === p) refreshInFlight = null;
  });
  return p;
}

// 请求拦截器
const requestInterceptor = (config: any) => {
  const { token } = storeToRefs(useUserStore());
  if (token.value) {
    config.header = {
      ...config.header,
      Authorization: `${token.value}`,
    };
  }

  // 设置超时时间
  config.timeout = 20000;

  const method = (config.method || "GET").toUpperCase();
  const forceEncrypt = config.encrypt === true;
  const disableEncrypt = config.encrypt === false;

  const needEncrypt = !disableEncrypt &&
    shouldEncryptRequest(config.security, {
      method,
      force: forceEncrypt,
    });

  if (needEncrypt) {
    config.data = encryptPayload(config.data, config.security, {
      method,
      force: forceEncrypt,
    });

    config.header = {
      ...config.header,
      "X-Encrypted": "1",
      "X-Encrypt-Alg": "XOR-BASE64",
    };
  }

  return config;
};

// 响应拦截器
const responseInterceptor = (response: any) => {
  const { statusCode, data } = response;
  // HTTP状态码检查
  if (statusCode !== HTTP_STATUS.SUCCESS && statusCode !== HTTP_STATUS.CREATED) {
    const err: RequestError = new Error(`HTTP错误: ${statusCode}`);
    err.statusCode = statusCode;
    err.data = data;
    throw err;
  }

  //后端接口返回的状态，请求成功的前提下
  if (data.code !== BUSINESS_CODE.SUCCESS) {
    const err: RequestError = new Error(data.message || "请求失败");
    err.statusCode = statusCode;
    err.data = data;
    throw err;
  }

  // 服务端返回加密包时自动解密
  const decrypted = decryptPayload(data, config.security);
  return decrypted;
};

// 错误处理
const errorHandler = async (error: any, retrySnapshot: Record<string, any>): Promise<any> => {
  console.error("请求错误:", error);

  if (error.statusCode === HTTP_STATUS.UNAUTHORIZED) {
    // 刷新接口自身 401 / 业务失败，或已重试过一次仍 401：不再刷新，避免死循环
    if (retrySnapshot.skipAuthRefresh === true || retrySnapshot.__tokenRetry === true) {
      const store = useUserStore();
      store.clearUser();
      uni.showToast({
        title: "登录已过期，请重新登录",
        icon: "none",
      });
      return Promise.reject(error);
    }

    const ok = await refreshSessionOnce();
    if (!ok) {
      useUserStore().clearUser();
      uni.showToast({
        title: "登录已过期，请重新登录",
        icon: "none",
      });
      setTimeout(() => {
        uni.reLaunch({
          url: "/pages/login/index",
        });
      }, 1500)
      return Promise.reject(error);
    }

    // 仅重试一次；新 token 已由 `applyAuthTokens` 写入 Pinia，拦截器会带上
    return request({
      ...retrySnapshot,
      __tokenRetry: true,
    });
  } else if (error.statusCode === HTTP_STATUS.SUCCESS) {
    uni.showToast({
      title: error.message || "网络请求失败",
      icon: "none",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
    return;
  }

  uni.showToast({
    title: error.message || "网络请求失败",
    icon: "none",
  });

  setTimeout(() => {
    uni.reLaunch({
      url: "/pages/login/index",
    });
  }, 1500);
  throw error;
};

// 封装uni.request
export const request = (options: any): Promise<any> => {
  const retrySnapshot = { ...options };

  return new Promise((resolve, reject) => {
    let requestUrl = "";
    // #ifdef MP-WEIXIN
    requestUrl = isAbsoluteUrl(options.url)
      ? options.url
      : `${config.baseURL}${config.apiVersion}${options.url}`;
    // #endif
    // #ifndef MP-WEIXIN
    requestUrl = isAbsoluteUrl(options.url) ? options.url : `${config.apiVersion}${options.url}`;
    // #endif
    if (!isApiDomainAllowed(requestUrl) && isAbsoluteUrl(requestUrl)) {
      reject(new Error(`请求域名不在白名单中: ${requestUrl}`));
      return;
    }

    const interceptedOptions = requestInterceptor({
      ...options,
      security: config.security,
      url: requestUrl,
      header: {
        "Content-Type": "application/json",
        ...options.header,
      },
    });

    uni.request({
      ...interceptedOptions,
      success: (response: any) => {
        try {
          const result = responseInterceptor(response);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      fail: (failError: any) => {
        reject(failError);
      },
    });
  }).catch((error) => errorHandler(error, retrySnapshot));
};

// 导出常用的请求方法
export const get = (url: string, params?: any, options?: any) => {
  return request({
    url,
    method: "GET",
    data: params,
    ...options,
  });
};

export const post = (url: string, data?: any, options?: any) => {
  return request({
    url,
    method: "POST",
    data,
    ...options,
  });
};

export const put = (url: string, data?: any, options?: any) => {
  return request({
    url,
    method: "PUT",
    data,
    ...options,
  });
};

export const del = (url: string, options?: any) => {
  return request({
    url,
    method: "DELETE",
    ...options,
  });
};

export const patch = (url: string, data?: any, options?: any) => {
  return request({
    url,
    method: "PATCH",
    data,
    ...options,
  });
};
