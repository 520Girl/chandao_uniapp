import { post, get, put } from '../request'
import { config } from '../config'

// Token存储键名
export const TOKEN_KEY = 'auth_token'
export const USER_INFO_KEY = 'user_info'
export const AUTO_FACE_KEY = 'auto_face'

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

// 刷新token
export const refreshToken = () => {
    return post('/refresh')
}

//最新一条存缴提取记录
export const getRecentDeposits = (userId: string) => {
    return get("/recent-deposits", { userId })
}

// 获取用户信息
export const getUserProfile = () => {
    return get('/profile')
}

// 更新用户信息
export const updateUserProfile = (userData: any) => {
    return put('/profile', userData)
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


export interface UploadImageParams {
    filePath: string
    name?: string
    formData?: Record<string, any>
    header?: Record<string, string>
}

export const uploadImage = (params: UploadImageParams) => {
    const token = getToken()
    const uploadUrl = `${config.uploadURL}${config.apiVersion}/upload`

    return new Promise<any>((resolve, reject) => {
        uni.uploadFile({
            url: uploadUrl,
            filePath: params.filePath,
            name: params.name || 'file',
            formData: params.formData || {},
            header: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(params.header || {})
            },
            success: (res) => {
                if (res.statusCode < 200 || res.statusCode >= 300) {
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

/** 音乐列表分页（字段名与后端约定一致时可调整） */
export interface GetMusicListParams {
    page?: number
    pageSize?: number
}

// 获取音乐列表
export const getMusicList = (params?: GetMusicListParams) => {
    return get("/music/list", params)
}

export interface GetMeditationRealtimeParams {
    sessionId?: string
}

/** 冥想进行中的实时生理指标 */
export const getMeditationRealtime = (params?: GetMeditationRealtimeParams) => {
    return get("/meditation/realtime", params)
}

export interface GetRankListParams {
    page?: number
    pageSize?: number
}

/** 排行榜分页（业务结构在页面内解析） */
export const getRankList = (params?: GetRankListParams) => {
    return get("/rank/list", params)
}