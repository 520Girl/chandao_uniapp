/**
 * 活动模块接口契约（`/app/activity/*`）。
 * 与后端 `Activity` 模块 DTO 对齐。
 */

/**
 * GET/POST `/app/activity/page` 查询参数（`ActivityAppPageQueryDTO`）。
 * - 不传 `teamId`：全局活动（`teamId` 为空）+ 可访问团队下活动；
 * - 传 `teamId`：仅该团队已发布活动（不含全局），且须在可访问团队内。
 */
export interface ActivityPageQuery {
  /** 页码，默认 1 */
  page?: number;
  /** 每页条数，默认 20，最大 100 */
  size?: number;
  /** 指定团队时仅该团队；不传则含全局+多团队 */
  teamId?: number;
}

/**
 * 团队可发布用活动模板项（`GET /app/activity/templates` 单行）。
 */
export interface ActivityTemplateItem {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  allowTeamPublish?: boolean;
}

/**
 * `POST /app/activity/createFromTemplate` Body（团队负责人发活动）。
 * `status=2` 发布时 `startDate`、`endDate` 必填（ISO 字符串）。
 */
export interface ActivityCreateFromTemplateBody {
  teamId: number;
  templateId: number;
  title: string;
  startDate?: string;
  endDate?: string;
  content?: string;
  /** `1` 草稿 / `2` 直接发布，默认 `2` */
  status?: number;
  /** `1` 每日打卡 / `2` 仅一次，默认 `1` */
  checkinMode?: number;
  targetMeditationSeconds?: number;
  passPercent?: number;
}

/**
 * 活动分页列表单行（后端 raw select 固定字段）。
 */
export interface ActivityPageListItem {
  id: number;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
  /** 置顶标记 */
  isTop: number;
  templateId: number;
  teamId?: number | null;
  /** 打卡模式，业务码以后端为准 */
  checkinMode: number;
  templateName?: string | null;
  templateIcon?: string | null;
  /** 目标冥想时间（秒） */
  targetMeditationSeconds: number;
  /** 通过百分比 */
  passPercent: number;
}

/** 分页信息 */
export interface ActivityPagination {
  page?: number;
  size?: number;
  total?: number;
}

/** POST `/app/activity/page` 的 data */
export interface ActivityPage {
  list: ActivityPageListItem[];
  pagination: ActivityPagination;
}

/** 打卡排行榜/列表项（`checkinStats.checkinList`） */
export interface ActivityCheckinListItem {
  userId: number;
  userName: string;
  checkinDays: number;
  todayChecked: boolean;
}

/** 活动详情 / 独立接口中的打卡统计 */
export interface ActivityCheckinStats {
  totalParticipants: number;
  todayCheckinCount: number;
  checkinList: ActivityCheckinListItem[];
}

/** GET `/app/activity/info` Query */
export interface ActivityInfoQuery {
  id: number;
}

/**
 * GET `/app/activity/info` 的 data。
 */
export interface ActivityDetail {
  id: number;
  templateId: number;
  teamId?: number | null;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
  isTop: number;
  authorId: number;
  /** 活动状态，业务码以后端为准 */
  status: number;
  /** 打卡模式，业务码以后端为准 */
  checkinMode: number;
  templateName?: string | null;
  templateIcon?: string | null;
  checkinStats: ActivityCheckinStats;
  passPercent: number;
  targetMeditationSeconds: number;
}

/** GET `/app/activity/checkinStats` Query */
export interface ActivityCheckinStatsQuery {
  id: number;
}

/** GET `/app/activity/checkinStats` 的 data（与详情内 `checkinStats` 同结构） */
export type ActivityCheckinStatsPayload = ActivityCheckinStats;

/** POST `/app/activity/join` Body */
export interface ActivityJoinDTO {
  id: number;
}

/**
 * POST `/app/activity/join` 的 data。
 * `checkins` 为参与记录上的聚合打卡态，结构以后端为准。
 */
export interface ActivityParticipation {
  id: number;
  userId: number;
  activityId: number;
  applyTime?: string | null;
  status: number;
  checkins?: unknown[] | null;
  createTime: string;
  updateTime: string;
}

/**
 * POST `/app/activity/checkin` Body。
 * - `lat`/`lng`/`accuracy`：线下场景建议上报；未取到定位时仍可仅传 `id`（依活动配置与后端校验）。
 * - `province`/`city`：展示用，可选；服务端亦可逆地理填充。
 */
export interface ActivityCheckinDTO {
  id: number;
  lat?: number;
  lng?: number;
  accuracy?: number;
  province?: string;
  city?: string;
}


export interface HomeActivityCard {
  id: number;
  templateId: number;
  /** 与列表项 `targetMeditationSeconds` 一致；场景卡进入禅修时换算为计划分钟 */
  targetMeditationSeconds: number;
  title: string;
  subtitle: string;
  sceneType: SceneType;
  bgClass: string;
  h2Class: string;
  spanClass: string;
  btnClass: string;
  imgUrl: string;
  endTime: string;
  totalTime?: string;
  passPercent?: number;
}


export type SceneType = "dark" | "light" | "simple";