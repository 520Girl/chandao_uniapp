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

/**
 * 密码登录、`/app/user/login/refreshToken` 等接口成功时 `data` 的常见形态。
 */
export interface AuthTokenPayload {
  token: string;
  refreshToken?: string | null;
}

/**
 * GET `/app/user/info/person` 的 data（UserPerson）。
 * 基于 `user_info` 并拼接 `teamName`；密码等敏感字段后端会剔除。
 */
export interface UserPerson {
  id: number;
  unionid?: string | null;
  avatarUrl?: string | null;
  nickName?: string | null;
  phone?: string | null;
  /** 角色（枚举见后端 userinfo.role dict） */
  role: number;
  invitedBy?: number | null;
  firstTeamId?: number | null;
  /** 是否人工指定角色（0/1） */
  isManualRole: number;
  /** 性别（0/1/2） */
  gender: number;
  /** 状态（1 正常，2 注销等） */
  status: number;
  /** 首团队名称（拼接字段） */
  teamName?: string | null;
  lastProvince?: string | null;
  lastCity?: string | null;
  createTime: string;
  updateTime: string;
}

/** Pinia 当前用户；与 `UserPerson` 一致 */
export type UserPayload = UserPerson;

export interface UserState {
  currentUser: UserPayload | null;
  token: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  unRead: number;
  /**
   * 未登录体验浏览（小程序合规）；与 `token` 互斥使用场景：有 token 时应为 false。
   * 持久化，便于下次打开仍可直接进首页。
   */
  guestMode: boolean;
}

/** POST `/app/user/info/updatePerson` Body（字段均可不传） */
export interface UpdatePersonDTO {
  nickName?: string | null;
  avatarUrl?: string | null;
  gender?: number | null;
  bio?: string | null;
}

/** POST `/app/user/info/updatePassword` Body */
export interface UpdatePasswordDTO {
  password: string;
  code: string;
}

/** POST `/app/user/info/bindPhone` Body */
export interface BindPhoneDTO {
  phone: string;
  code: string;
}

/** POST `/app/user/info/miniPhone` Body（登录态内绑定小程序手机号） */
export interface MiniPhoneBindDTO {
  code: string;
  encryptedData: string;
  iv: string;
}

/** POST `/app/user/location/report` Body */
export interface UserLocationReport {
  lat?: number;
  lng?: number;
  /** 定位精度（米） */
  accuracy?: number;
  province?: string;
  city?: string;
  /** 场景：login / meditation / activity_checkin 等 */
  scene?: string;
}

/** POST `/app/user/location/reverse` Body */
export interface ReverseGeoDTO {
  lat: number;
  lng: number;
}

/** POST `/app/user/location/reverse` 的 data */
export interface ReverseGeoResult {
  province: string | null;
  city: string | null;
}

/** GET `/app/user/myTeams` Query */
export interface MyTeamsQuery {
  /** 0=当前团队（exitType=0），1=历史团队（exitType!=0）；默认 0 */
  status?: number;
}

/** GET `/app/user/myTeams` 列表项 */
export interface MyTeamItem {
  /** teammember 记录 ID */
  id: number;
  teamId: number;
  userId: number;
  joinedAt: string;
  leftAt?: string | null;
  /** 0 在职；1 主动退出；2 管理员移除 */
  exitType: number;
  operatorId?: number | null;
  teamName: string;
  ownerId: number;
  memberCount: number;
  /** 用户内展示排序，越小越靠前（缺省 0） */
  sortOrder?: number;
}

/** POST `/app/user/myTeams/reorder` Body：须为当前全部在职团队 ID 的一个全排列 */
export interface MyTeamsReorderBody {
  teamIds: number[];
}

/** POST `/app/user/joinByInvite` Body */
export interface JoinByInviteDTO {
  code: string;
}

/** 创建邀请接口成功时 `data` 共有字段（`/app/user/createTeamInvite`、`createPersonalInvite` 及管理端创建） */
export interface UserInviteCreatedData {
  id: number;
  code: string;
  expireTime: string;
  /** 如 `/invite?code=...` */
  url: string;
  /** 小程序码图片 URL，可能为 `null` */
  miniProgramQrUrl?: string | null;
}

/** POST `/app/user/createTeamInvite` Body；仅当前用户为 `ownerId` 的团队负责人可创建 */
export interface CreateTeamInviteDTO {
  teamId: number;
  /** 有效天数，默认 7，范围 1～365 */
  days?: number;
  /** 若传则仅该 `user_info.id` 可使用本邀请 */
  bindUserId?: number;
}

/** POST `/app/user/createPersonalInvite` Body；任意登录用户可发起个人成团 */
export interface CreatePersonalInviteDTO {
  /** 有效天数，默认 7 */
  days?: number;
  /** 可选，仅指定用户可使用 */
  bindUserId?: number;
}

/**
 * POST `/app/user/joinByInvite` 的 data。
 * 团队邀请或已成团：`teamId` 有值，`personalFormation` 为 `false`。
 * 个人成团未满员：`teamId` 为 `null`，`personalFormation: true`，`formed: false`，可能带 `formationProgress`。
 */
export interface JoinByInviteResult {
  teamId: number | null;
  personalFormation: boolean;
  formed?: boolean;
  formationProgress?: {
    current: number;
    need: number;
  };
}

/** POST `/app/user/quitTeam` Body */
export interface QuitTeamDTO {
  teamId: number;
}

export interface UploadImageParams {
  filePath: string;
  name?: string;
  formData?: Record<string, any>;
  header?: Record<string, string>;
  key?: string;
  scene?: string;
}
