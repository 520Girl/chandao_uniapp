/**
 * 用户登录、资料、团队、定位、疗愈音乐分页等 HTTP（`/app/user/*`、`/app/music/*`）。
 */
import { post, get } from "../request";
import { config } from "../config";
import type { MusicPageQuery } from "@/types/api/music";
import type {
  BindPhoneDTO,
  JoinByInviteDTO,
  LoginPayload,
  MiniPhoneBindDTO,
  MyTeamsQuery,
  QuitTeamDTO,
  ReverseGeoDTO,
  UpdatePasswordDTO,
  UpdatePersonDTO,
  UploadImageParams,
  UserLocationReport,
} from "@/types/api/user";

// Token存储键名
export const TOKEN_KEY = 'auth_token'
export const USER_INFO_KEY = 'user_info'
export const AUTO_FACE_KEY = 'auto_face'

/**
 * 手机号密码登录。
 * @param payload `phone`、`password`
 */
export const passwordLogin = (payload: LoginPayload) => {
  return post("/app/user/login/password", payload);
};

const USER_INFO_PERSON = "/app/user/info/person";
const USER_INFO_UPDATE_PERSON = "/app/user/info/updatePerson";
const USER_INFO_UPDATE_PASSWORD = "/app/user/info/updatePassword";
const USER_INFO_LOGOFF = "/app/user/info/logoff";
const USER_INFO_LOGOUT = "/app/user/info/logout";
const USER_INFO_BIND_PHONE = "/app/user/info/bindPhone";
const USER_INFO_MINI_PHONE = "/app/user/info/miniPhone";
const USER_LOCATION_REPORT = "/app/user/location/report";
const USER_LOCATION_REVERSE = "/app/user/location/reverse";
const USER_JOIN_INVITE = "/app/user/joinByInvite";
const USER_QUIT_TEAM = "/app/user/quitTeam";
const USER_MY_TEAMS = "/app/user/myTeams";

/**
 * 获取当前登录用户资料（UserPerson）；需登录。
 */
export const fetchUserProfile = () => {
  return get(USER_INFO_PERSON);
};

/**
 * 更新用户资料；成功后 `data` 为更新后的 UserPerson；需登录。
 *
 * @param body `nickName` / `avatarUrl` / `gender` / `bio` 可选
 */
export const updateUserProfile = (body: UpdatePersonDTO) => {
  return post(USER_INFO_UPDATE_PERSON, body);
};

/**
 * 修改密码；成功后业务 `data` 为 `null`；需登录。
 *
 * @param body `password` 新密码，`code` 短信/验证码
 */
export const postUserUpdatePassword = (body: UpdatePasswordDTO) => {
  return post(USER_INFO_UPDATE_PASSWORD, body);
};

/**
 * 注销账号；成功后业务 `data` 为 `null`；需登录。
 */
export const postUserLogoff = () => {
  return post(USER_INFO_LOGOFF, {});
};

/**
 * 退出登录；成功后业务 `data` 为 `null`；需登录。
 */
export const logoutUser = () => {
  return post(USER_INFO_LOGOUT, {});
};

/**
 * 绑定手机号；成功后业务 `data` 为 `null`；需登录。
 */
export const postUserBindPhone = (body: BindPhoneDTO) => {
  return post(USER_INFO_BIND_PHONE, body);
};

/**
 * 登录态内绑定小程序手机号；成功后 `data` 为 UserPerson；需登录。
 */
export const postUserMiniPhone = (body: MiniPhoneBindDTO) => {
  return post(USER_INFO_MINI_PHONE, body);
};

/**
 * 上报用户位置（展示/排行榜等）；成功后业务 `data` 为 `null`；需登录。
 *
 * @param body 经纬度、精度、省市、场景等；可只传 lat/lng/accuracy 由后端逆地理
 */
export const postUserLocationReport = (body: UserLocationReport) => {
  return post(USER_LOCATION_REPORT, body);
};

/**
 * 经纬度转省市；需登录。依赖后端地图 Key，否则可能返回 null。
 *
 * @param body `lat` / `lng`
 */
export const postUserLocationReverse = (body: ReverseGeoDTO) => {
  return post(USER_LOCATION_REVERSE, body);
};

/**
 * 通过邀请码加入团队；成功后 `data` 含 `teamId`；需登录。
 */
export const postUserJoinByInvite = (body: JoinByInviteDTO) => {
  return post(USER_JOIN_INVITE, body);
};

/**
 * 主动退出团队；成功后业务 `data` 为 `null`；需登录。
 */
export const postUserQuitTeam = (body: QuitTeamDTO) => {
  return post(USER_QUIT_TEAM, body);
};

/**
 * 我的团队列表；需登录。
 *
 * @param query `status`：0 当前团队，1 历史团队；默认 0
 */
export const fetchMyTeams = (query?: MyTeamsQuery) => {
  return get(USER_MY_TEAMS, query ?? {});
};


/**
 * 刷新 access token；**必须**走 `skipAuthRefresh`，否则会与 `request` 内 401 刷新逻辑互相递归。
 */
export const refreshTokenHttp = (refreshToken: string) => {
  return post(
    "/app/user/login/refreshToken",
    { refreshToken },
    { skipAuthRefresh: true },
  );
};


/**
 * 上传图片,需要确认上传模式 为本地还是云模式，但是都是通过上传接口获取信息
 * @param {Object} params - 参数对象
 * - `filePath`: 图片文件路径
 * - `name`: 图片文件名（默认为 'file'）
 * - `formData`: 额外的表单数据
 * - `header`: 额外的请求头
 * @returns {Promise} - 上传结果
 */

// 获取上传图片模式
export const getUploadMode = () => {
    return get('/app/base/comm/uploadMode')
}

export const uploadImage = (params: UploadImageParams) => {
    const { token } = storeToRefs(useUserStore())
    const uploadUrl = `${config.apiVersion}/app/base/comm/upload`

    const formData = {
        ...(params.formData || {}),
        scene: params.scene || 'avatar',
        ...(params.key ? { key: params.key } : {}),
    }

    return new Promise<any>((resolve, reject) => {
        uni.uploadFile({
            url: uploadUrl,
            filePath: params.filePath,
            name: params.name || 'file',
            formData,
            header: {
                ...(token ? { Authorization: `${token.value}` } : {}),
                ...(params.header || {})
            },
            success: (res: any) => {
                
                if (res.statusCode >= 300) {
                    reject(new Error(`上传失败: HTTP ${res.statusCode}`))
                    return
                }

                try {
                    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
                    resolve(data)
                } catch (error) {
                    reject(new Error('上传成功但响应解析失败'))
                }
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}

/**
 * 我的团队列表（同 `fetchMyTeams`）；需登录。
 * @deprecated 新代码请使用 `fetchMyTeams`
 */
export const getUserTeam = (query?: MyTeamsQuery) => {
  return fetchMyTeams(query);
};

















// 用户登录
export const login = (data: { phone: string; password: string; }) => {
    return post('/login', data)
}

// 微信小程序登录测试
export const miniProgramLogin = (data: {
    code: string;
    iv?: string;
    encryptedData?: string;
    rawData?: string;
    signature?: string;
    userInfo?: any;
}) => {
    return post('/app/user/login/mini', data, {
        encrypt: false
    })
}

// 用户登出
export const logout = () => {
    return post('/logout')
}


//最新一条存缴提取记录
export const getRecentDeposits = (userId: string) => {
    return get("/recent-deposits", { userId })
}

// 获取用户信息
export const getUserProfile = () => {
    return get('/profile')
}

// 公共资金明细
// - `page`: 页码（默认1）
// - `pageSize`: 每页数量（默认20）
// - `startDate`: 开始日期
// - `endDate`: 结束日期
// - `transactionType`: 交易类型（1缴存、2结息、3提取）
export const getPublicMoneyList = (params: { page: number, pageSize: number, startDate: string, endDate: string, transactionType: number }) => {
    return get("/housing-fund-details", params)
}

// Token管理
export const getToken = (): string | null => {
    try {
        return uni.getStorageSync(TOKEN_KEY) || null
    } catch (error) {
        console.error('获取token失败:', error)
        return null
    }
}

export const setToken = (token: string): void => {
    try {
        uni.setStorageSync(TOKEN_KEY, token)
    } catch (error) {
        console.error('保存token失败:', error)
    }
}

export const setAutoFace = (autoFace: boolean): void => {
    try {
        uni.setStorageSync(AUTO_FACE_KEY, autoFace)
    } catch (error) {
        console.error('保存自动人脸识别失败:', error)
    }
}
export const removeToken = (): void => {
    try {
        uni.removeStorageSync(TOKEN_KEY)
    } catch (error) {
        console.error('删除token失败:', error)
    }
}

// 用户信息管理
export const getUserInfoFromStorage = () => {
    try {
        return uni.getStorageSync(USER_INFO_KEY) || null
    } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
    }
}

export const getAutoFaceFromStorage = () => {
    try {
        return uni.getStorageSync(AUTO_FACE_KEY) || null
    } catch (error) {
        console.error('获取自动人脸识别失败:', error)
        return null
    }
}

export const setUserInfo = (userInfo: any): void => {
    try {
        uni.setStorageSync(USER_INFO_KEY, userInfo)
    } catch (error) {
        console.error('保存用户信息失败:', error)
    }
}

export const removeUserInfo = (): void => {
    try {
        uni.removeStorageSync(USER_INFO_KEY)
    } catch (error) {
        console.error('删除用户信息失败:', error)
    }
}

// 检查是否已登录
export const isLoggedIn = (): boolean => {
    const token = getToken()
    return !!token
}

// 清除所有认证信息
export const clearAuth = (): void => {
    removeToken()
    removeUserInfo()
    setAutoFace(false)
} 




const MUSIC_PAGE_PATH = "/app/music/page";

/**
 * 疗愈音乐分页列表；需登录。
 *
 * @param query `page` 默认 1，`size` 默认 20；业务码见全局约定
 * @returns 业务包，`data` 为 `MusicPageData`（`list` + `pagination`）
 */
export const getMusicPage = (query?: MusicPageQuery) => {
  return get(MUSIC_PAGE_PATH, query);
};

export interface GetRankListParams {
    page?: number
    pageSize?: number
}

/** 排行榜分页（业务结构在页面内解析） */
export const getRankList = (params?: GetRankListParams) => {
    return get("/rank/list", params)
}

