import { storeToRefs } from "pinia";
import { config, HTTP_STATUS, BUSINESS_CODE, isApiDomainAllowed } from "./config";
import { decryptPayload, encryptPayload, shouldEncryptRequest } from "./crypto";
import { useUserStore } from "@/stores/user";
import type { AuthTokenPayload } from "@/types/api/user";
import type { RequestError } from "@/types/config";
import {
  createGuestBlockedError,
  isGuestBlockedError,
  isGuestPublicApiUrl,
} from "@/utils/guestRequest";

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

/** @param path 以 `/` 开头的页面路径，如 `/pages/index/join` */
function isCurrentRoute(path: string): boolean {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1] as { route?: string } | undefined;
  const route = page?.route;
  if (!route) return false;
  const normalized = route.startsWith("/") ? route : `/${route}`;
  return normalized === path;
}

/** 冥想报告分享访客页（免登录 `report/share`），失败时不应跳转登录 */
function isMeditationReportShareVisitorPage(): boolean {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1] as {
    route?: string;
    options?: Record<string, string | undefined>;
  };
  const route = page?.route ?? "";
  const opts = page?.options ?? {};
  if (route.includes("meditation/report-share")) return true;
  if (route.includes("meditation/report") && String(opts.token ?? "").trim()) return true;
  return false;
}

function isMeditationReportSharePublicRequest(snapshot: Record<string, unknown>): boolean {
  return String(snapshot?.url ?? "").includes("/app/meditation/report/share");
}

/**
 * 设备轮询类请求（首页等定时拉取）。业务失败时仅提示，不应 `navigateBack` 误关当前页。
 * @param snapshot `request` 调用时的 options，含完整 `url`
 */
function isDeviceStatusOrRealtimeRequest(snapshot: Record<string, unknown>): boolean {
  const u = String(snapshot?.url ?? "");
  return u.includes("/app/device/realtime") || 
  u.includes("/app/device/status") || 
  u.includes("/app/activity/createFromTemplate") || 
  u.includes("/app/meditation/report/detail") || 
  u.includes("/app/meditation/report/statistics");
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

  if (isGuestBlockedError(error)) {
    uni.showToast({
      title: error?.message || "体验模式下请登录后使用",
      icon: "none",
    });
    return Promise.reject(error);
  }

  if (error.statusCode === HTTP_STATUS.UNAUTHORIZED) {
    // 刷新接口自身 401 / 业务失败，或已重试过一次仍 401：不再刷新，避免死循环
    if (isMeditationReportSharePublicRequest(retrySnapshot) || isMeditationReportShareVisitorPage()) {
      uni.showToast({
        title: error?.message || "分享链接无效或已失效",
        icon: "none",
      });
      return Promise.reject(error);
    }

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
      if (!isMeditationReportShareVisitorPage()) {
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/login/index",
          });
        }, 1500);
      }
      return Promise.reject(error);
    }

    // 仅重试一次；新 token 已由 `applyAuthTokens` 写入 Pinia，拦截器会带上
    return request({
      ...retrySnapshot,
      __tokenRetry: true,
    });
  } else if (error.statusCode === HTTP_STATUS.SUCCESS) {
    console.log("error.statusCode", error.message);
    // uni.showToast({
    //   title: error.message || "请求失败",
    //   icon: "none",
    // });
    // return;
    const store = useUserStore();
    const noToken = !String(store.token ?? "").trim();
    /** 未登录/体验：接口返回业务失败时不要显示笼统「请求失败」，也不要 navigateBack */
    if (noToken || store.guestMode) {
      uni.showToast({
        title: store.guestMode
          ? "体验模式下请登录后使用完整功能"
          : "请先登录",
        icon: "none",
      });
      return Promise.reject(error);
    }
    uni.showToast({
      title: error.message || "网络请求失败",
      icon: "none",
    });
    setTimeout(() => {
      if (
        isCurrentRoute("/pages/index/join") ||
        isCurrentRoute("/pages/login/inputLogin") ||
        isMeditationReportShareVisitorPage() ||
        isDeviceStatusOrRealtimeRequest(retrySnapshot)
      ) {
        return Promise.reject(error);
      }
      uni.navigateBack();
    }, 1500);
    return Promise.reject(error);
  }

  const storeForNet = useUserStore();
  const noTok = !String(storeForNet.token ?? "").trim();
  if (noTok || storeForNet.guestMode) {
    uni.showToast({
      title: storeForNet.guestMode
        ? "体验模式下请登录后使用完整功能"
        : "请先登录",
      icon: "none",
    });
    return Promise.reject(error);
  }

  uni.showToast({
    title: error.message || "网络请求失败",
    icon: "none",
  });

  setTimeout(() => {
    if (isCurrentRoute("/pages/index/join") || isMeditationReportShareVisitorPage()) return;
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

    const userStore = useUserStore();
    const skipGuest = retrySnapshot.skipGuestBlock === true;
    if (userStore.guestMode && !userStore.token && !skipGuest && !isGuestPublicApiUrl(requestUrl)) {
      reject(createGuestBlockedError());
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
