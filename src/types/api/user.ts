export interface WechatLoginPayload {
  code: string;
  iv: string;
  encryptedData: string;
  rawData?: string;
  signature?: string;
  userInfo?: any;
}


export interface LoginPayload {
    phone: string;
    password: string;
}


export interface UserPayload {
    id: number
    createTime: string
    updateTime?: string
    tenantId?: any
    unionid?: string
    avatarUrl: string
    nickName: string
    phone: string
    role: number
    invitedBy?: number
    firstTeamId?: number
    isManualRole?: number
    gender: number
    status?: number
    teamName: string
}

export interface UserState {
    currentUser: UserPayload | null
    token: string | null
    refreshToken: string | null
    isLoggedIn: boolean
    loading: boolean
    unRead: number
}


export interface UploadImageParams {
    filePath: string
    name?: string
    formData?: Record<string, any>
    header?: Record<string, string>
    key?: string
    scene?: string
}