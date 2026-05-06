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
  /** 是否包含已结束的活动，默认 0 */
  includeExpired?: 0 | 1;
}

/**
 * 团队可发布用活动模板项（`GET /app/activity/templates` 单行）。
 * 以下默认字段若后端返回则用于 `applyTemplateDefaults`，否则由 App 按模板 id 推断活动类型等。
 */
export interface ActivityTemplateItem {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  allowTeamPublish?: boolean;
  activityTypeDefault?: number | null;
  checkinModeDefault?: number | null;
  targetMeditationSecondsDefault?: number | null;
  passPercentDefault?: number | null;
  sessionConfigDefault?: string | Record<string, unknown> | null;
}

/**
 * 多人共修 `sessionConfig`（与根级 `startDate`/`endDate` 计划时间同源）。
 */
export interface ActivityGroupSessionConfigPayload {
  startMode: "scheduled";
  roomNo: string | null;
  maxParticipants: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  rankGraceSeconds: number;
}

/**
 * `POST /app/activity/createFromTemplate` Body（团队负责人发活动）。
 * `status=2` 发布时 `startDate`、`endDate` 必填；`YYYY-MM-DD HH:mm:ss` 与后台一致。
 */
export interface ActivityCreateFromTemplateBody {
  teamId: number;
  templateId: number;
  title: string;
  /** `1` 普通打卡 / `2` 多人共修 */
  activityType?: number;
  startDate?: string;
  endDate?: string;
  content?: string;
  /** `1` 草稿 / `2` 直接发布，默认 `2` */
  status?: number;
  /** `1` 每日打卡 / `2` 仅一次；多人共修提交固定为 `2` */
  checkinMode?: number;
  targetMeditationSeconds?: number;
  passPercent?: number;
  /** 普通活动传 `null`；多人共修传计划窗与房间配置 */
  sessionConfig?: ActivityGroupSessionConfigPayload | null;
  /** `0`/`1` 是否置顶 */
  isTop?: number;
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
  sessionConfig?: {
    maxParticipants?: number;
  };
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

/** POST `/app/activity/ready` Body（多人共修 activityType=2） */
export interface ActivityReadyDTO {
  /** 活动 ID */
  id: number;
  /** `1` 就绪 / `0` 取消就绪 */
  ready: 0 | 1;
}

/** POST `/app/activity/ready` 的 data */
export interface ActivityReadyResult {
  activityId: number;
  userId: number;
  readyStatus: number;
}

/** GET `/app/activity/serverTime` 的 data（无需登录） */
export interface ActivityServerTimeData {
  serverTime: number;
}

/** GET `/app/activity/roomState` Query */
export interface ActivityRoomStateQuery {
  id: number;
}

/** 房间成员（`roomState.participants[]`） */
export interface ActivityRoomParticipant {
  userId: number;
  readyStatus: number;
  /** `2` 发起人/房主，`1` 普通成员 */
  roomRole: number;
  nickName?: string | null;
  avatarUrl?: string | null;
}

/** GET `/app/activity/roomState` 的 data */
export interface ActivityRoomStateData {
  activityId: number;
  title: string;
  teamId?: number | null;
  /** `0` 待开场 / `1` 进行中 / `2` 已结算 */
  phase: number;
  startAt?: string | null;
  endAt?: string | null;
  maxParticipants: number;
  participantCount: number;
  readyCount: number;
  participants: ActivityRoomParticipant[];
  lockedRosterUserIds: number[];
  serverTime: number;
  msUntilStart: number;
  msUntilEnd: number;
  inScheduledWindow: boolean;
  rankGraceSeconds: number;
  suggestStartMeditation: boolean;
  suggestStopMeditation: boolean;
  suggestPrepareSoon: boolean;
}

/** GET `/app/activity/roomResult` Query */
export interface ActivityRoomResultQuery {
  id: number;
}

/**
 * 榜单单项（`roomResult` 三榜结构一致；旧版四榜接口可能多返回下列可选字段）。
 */
export interface ActivityRoomRankingEntry {
  rank: number;
  userId: number;
  nickName: string;
  avatarUrl?: string | null;
  /** 统计窗内纳入汇总的 `totalDuration` 之和（秒） */
  durationSeconds: number;
  avgHeartRateWeighted: number;
  avgBreathRateWeighted: number;
  movementCount: number;
  lastSessionEnd?: string | null;
  /** 旧版四榜 */
  focusScoreWeighted?: number;
  sitCount?: number;
  stabilityScore?: number;
  compositeScore?: number;
}

/** `rankings`：平均心率 / 平均呼吸率 / 体动次数（各为独立排序列表） */
export interface ActivityRoomResultRankings {
  avgHeartRate: ActivityRoomRankingEntry[];
  avgBreathRate: ActivityRoomRankingEntry[];
  movementCount: ActivityRoomRankingEntry[];
}

/** GET `/app/activity/roomResult` 的 data */
export interface ActivityRoomResultData {
  activityId: number;
  phase: number;
  startAt: string;
  endAt: string;
  rankGraceSeconds: number;
  rankWindowStartAt: string;
  rankWindowEndAt: string;
  rosterUserIds?: number[];
  rankings: ActivityRoomResultRankings;
}


export interface HomeActivityCard {
  id: number;
  templateId: number;
  /** 与列表项 `targetMeditationSeconds` 一致；场景卡进入禅修时换算为计划分钟 */
  targetMeditationSeconds: number;
  title: string;
  subtitle: string;
  sceneType: SceneType;
  /** 是否已超过 `endDate`（用于褪色样式与禁止「即刻参与」） */
  isExpired: boolean;
  bgClass: string;
  h2Class: string;
  spanClass: string;
  btnClass: string;
  tipClass: string;
  bgOpacityClass: string;
  imgUrl: string;
  endTime: string;
  totalTime?: string;
  passPercent?: number;
  maxParticipants?: number;
}


export type SceneType = "dark" | "light" | "simple" | "group";