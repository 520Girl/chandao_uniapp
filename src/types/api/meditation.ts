/**
 * 用户端冥想会话：`/app/meditation/start|poll|end` 请求与响应契约。
 */

/** 开始冥想请求体 `MeditationStartDTO` */
export interface MeditationStartDTO {
  /** `1` 设备冥想 / `2` 无设备；缺省由后端按是否有 `sn` 推断 */
  type?: number;
  /** 设备 SN；`type=1` 时必填 */
  sn?: string;
  /** 目标时长（分钟） */
  targetDuration: number;
}

/** 开始冥想成功返回 `MeditationStartResult` */
export interface MeditationStartResult {
  /** session 记录 ID */
  id: number;
  /** 与 `id` 一致（兼容字段） */
  sessionId: number;
  userId: number;
  /** `1` 设备 / `2` 无设备 */
  type: number;
  /** 设备 SN；无设备冥想为 `null` */
  sn: string | null;
  startDate: string;
  endDate?: string | null;
  /** `1` 进行中 / `2` 已结束 / `3` 异常中断 */
  status: number;
  targetDuration: number;
  lastActiveTime: string;
  /** 建议客户端轮询间隔（毫秒）；与 `pollDelayMs` 至少其一有值即可 */
  pollInterval?: number;
  /** 与 `pollInterval` 同义（毫秒） */
  pollDelayMs?: number;
  /** 结束原因：`1` 手动 / `2` 超时 / `3` 到时；进行中为 `null` */
  endReason?: number | null;
}

/** 轮询请求体 `MeditationPollDTO` */
export interface MeditationPollDTO {
  /** 不传则后端查找当前进行中会话 */
  sessionId?: number;
}

/**
 * 设备云单侧（左/右）生理与波形；字段以后台为准，未列出的键可能仍存在。
 */
export interface MeditationPollRespSide {
  respiration_rate: number;
  heart_rate: number;
  /** 心率波形采样等 */
  heart_rate_wave?: number[];
  respiratory_wave?: number[];
}

/**
 * `poll.resp.data[]` 单条记录：在床、体动、温湿度及左右侧数据。
 */
export interface MeditationPollRespDataItem {
  date: string;
  id: number;
  temperature?: number;
  humidity?: number;
  inbed?: boolean;
  body_movement?: boolean;
  left?: MeditationPollRespSide;
  right?: MeditationPollRespSide;
}

/**
 * `poll` 进行中返回的 `resp` 外壳（设备云风格）。
 * @example ret/err_code/msg、timestamp、mac、`data` 为时序采样数组。
 */
export interface MeditationPollRespEnvelope {
  ret: number;
  err_code: number;
  msg: string;
  timestamp: number;
  mac: string;
  /** 时序采样；缺省或空数组表示暂无数据行 */
  data?: MeditationPollRespDataItem[];
}

/** 轮询进行中 `MeditationPollResult` */
export interface MeditationPollOngoing {
  status: "ongoing";
  /** 设备实时数据包（`MeditationPollRespEnvelope`）；无设备或暂未拉到设备时可能为 `null` */
  resp: MeditationPollRespEnvelope | null;
  /** 本次落库数据；设备在线且设备冥想时可能有 */
  saved: unknown;
  /**
   * 设备云端 `status.id`；与设备列表一致，如 `3` 离床。
   * 当 `resp` 为 `null` 且为 `3` 时，前端展示离床、静息、心率/呼吸为 0。
   */
  deviceStatusId: number | null;
  /** 已进行秒数 */
  elapsed: number;
}

/** 轮询已结束 */
export interface MeditationPollEnded {
  status: "ended";
  /** `finished` | `timeout` | `target` */
  reason: string;
  /** `1` 手动 / `2` 超时 / `3` 到时 */
  endReason?: number;
}

/** 结束冥想请求 `MeditationEndDTO` */
export interface MeditationEndDTO {
  sessionId: number;
}

/** `POST /app/meditation/end` 返回 `MeditationEndResult`（非完整报告体） */
export interface MeditationEndResult {
  sessionId: number;
  /** 报告 ID；可与 `sessionId` 用于后续查询 */
  reportId: number | null;
  status: "ended";
  /** `1` 手动 / `2` 超时 / `3` 到时 */
  endReason?: number;
  endDate?: string | null;
}

/** 报告分段（6 段之一） */
export interface MeditationReportSection {
  index: number;
  avgHeartRate?: number;
  avgBreathRate?: number;
  movementCount?: number;
}

/**
 * 冥想报告详情 `MeditationReport`（与 `GET /app/meditation/report/detail` 单条一致）。
 */
export interface MeditationReport {
  id: number;
  sessionId: number;
  /** 总时长（秒） */
  totalDuration: number;
  /** 累计冥想天数 */
  totalDays?: number;
  /** 累计冥想总时长（小时） */
  totalHours?: number;
  /** 连续冥想天数 */
  consecutiveDays?: number;
  /** 专注度 0–100；无设备冥想默认 0 */
  focusScore: number;
  achievements?: string[] | null;
  avgHeartRate?: number;
  avgBreathRate?: number;
  movementCount?: number;
  hrvScore?: number;
  /** `heartRate` / `none` */
  hrvSource?: string;
  avgTemperature?: number;
  avgHumidity?: number;
  peaceRatio?: number;
  relaxRatio?: number;
  tensionRatio?: number;
  anxietyRatio?: number;
  /** 执着厌离分 1–100；无设备默认 50 */
  attachmentRatio?: number;
  sections?: MeditationReportSection[] | null;
  sitCount?: number;
  movementPerMinute?: number;
  breathLevel?: number;
  breathText?: string;
  breathShort?: string;
  heartLevel?: number;
  heartText?: string;
  heartShort?: string;
  stabilityLevel?: number;
  stabilityText?: string;
  stabilityShort?: string;
  /** 合成一句总评 */
  summaryText?: string;
  createTime: string;
  updateTime: string;
}

/** 与 5.4 历史单条结构一致（别名） */
export type MeditationReportHistoryItem = MeditationReport;
