import { config } from '../config';
import { miniProgramLogin } from './user';

const WX_CLOUD_FUNCTION_NAME = 'miniLogin';
const WX_CLOUD_ENV = 'cloud1-1g4niy3t1a61e52b';

export interface WechatLoginPayload {
  code: string;
  iv: string;
  encryptedData: string;
  rawData?: string;
  signature?: string;
  userInfo?: any;
}

// 调用微信登录 API 获取一次性 code，供后端换取 session_key/openid。
const getWechatLoginCode = () => {
  return new Promise<string>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (result) => {
        if (result.code) {
          resolve(result.code);
          return;
        }
        reject(new Error('未获取到微信登录 code'));
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

// 拉取微信用户加密资料，后端可用 encryptedData + iv 解密用户信息。
const getEncryptedWechatUserData = () => {
  return new Promise<{
    encryptedData: string;
    iv: string;
    rawData?: string;
    signature?: string;
    userInfo?: any;
  }>((resolve, reject) => {
    // #ifdef MP-WEIXIN
    const wxRuntime = (globalThis as any).wx;

    if (!wxRuntime?.getUserProfile) {
      reject(new Error('当前环境不支持 getUserProfile'));
      return;
    }

    wxRuntime.getUserProfile({
      desc: '用于完善会员资料',
      lang: 'zh_CN',
      success: (result: any) => {
        const encryptedData = result?.encryptedData || '';
        const iv = result?.iv || '';
        if (encryptedData && iv) {
          resolve({
            encryptedData,
            iv,
            rawData: result?.rawData,
            signature: result?.signature,
            userInfo: result?.userInfo,
          });
          return;
        }

        reject(new Error('微信未返回完整用户加密信息'));
      },
      fail: (error: any) => {
        reject(new Error(error?.errMsg || '用户取消授权，无法继续登录'));
      },
    });
    // #endif

    // #ifndef MP-WEIXIN
    reject(new Error('仅支持微信小程序登录'));
    // #endif
  });
};

// 本地开发时通过云函数中转登录，避免小程序域名白名单限制。
const callWechatCloudLogin = async (payload: WechatLoginPayload) => {
  // #ifdef MP-WEIXIN
  const wxRuntime = (globalThis as any).wx;
  if (!wxRuntime?.cloud) {
    throw new Error('当前小程序未开启云开发，请先在微信开发者工具启用云开发');
  }

  wxRuntime.cloud.init({
    env: WX_CLOUD_ENV,
    traceUser: true,
  });

  const result = await wxRuntime.cloud.callFunction({
    name: WX_CLOUD_FUNCTION_NAME,
    data: payload,
  });

  return result?.result ?? result;
  // #endif

  throw new Error('仅支持微信小程序云函数登录');
};

// 统一判断业务状态，后端明确失败时直接抛错。
const assertLoginSuccess = (payload: any) => {
  const businessCode = payload?.code;
  if (businessCode === 0 || businessCode === '0' || payload?.success === false) {
    throw new Error(payload?.message || '微信登录失败');
  }
};

// 兼容不同后端字段命名，提取 token。
const extractToken = (payload: any): string | null => {
  const data = payload?.data ?? payload;
  const token = data?.token ?? payload?.token ?? payload?.signature;
  if (typeof token === 'string' && token.trim()) return token.trim();
  if (token != null) {
    const t = String(token).trim();
    if (t) return t;
  }
  return null;
};

const extractRefreshToken = (payload: any): string | null => {
  const data = payload?.data ?? payload;
  const rt = data?.refreshToken ?? payload?.refreshToken;
  if (typeof rt === 'string' && rt.trim()) return rt.trim();
  return null;
};

const extractUser = (payload: any): any => {
  const data = payload?.data ?? payload;
  return data?.user ?? payload?.user ?? null;
};



// 按 config 决定登录链路：
// - 开发环境：云函数中转到本地后端
// - 生产环境：直接请求线上后端
export const wechatMiniLoginByConfig = async () => {
  const profile = await getEncryptedWechatUserData();
  console.log('profile',JSON.stringify(profile));
  const code = await getWechatLoginCode();
  const payload: WechatLoginPayload = {
    code,
    encryptedData: profile.encryptedData,
    iv: profile.iv,
    // rawData: profile.rawData,
    // signature: profile.signature,
    // userInfo: profile.userInfo,
  };

  const response = config.debug
    ? await callWechatCloudLogin(payload)
    : await miniProgramLogin(payload);

  assertLoginSuccess(response);

  const token = extractToken(response);
  const refreshToken = extractRefreshToken(response);
  const user = extractUser(response) ?? profile.userInfo ?? null;

  if (!token) {
    throw new Error('后端未返回 token，请检查接口响应结构');
  }

  return {
    token,
    refreshToken,
    user,
    raw: response,
  };
};
