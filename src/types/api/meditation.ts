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

/** `GET /app/meditation/report/statistics` 的 `range` 查询；缺省后端按 `week` */
export type MeditationStatisticsRange = "day" | "week" | "month";

/** 统计接口 Query */
export interface MeditationReportStatisticsQuery {
  range?: MeditationStatisticsRange;
}

/** 柱状图 / 折线图共用的单系列结构（`data` 与 `categories` 等长，单位：分钟） */
export interface MeditationChartSeriesItem {
  name: string;
  data: number[];
}

/** `durationChartData` / `compareChartData` 结构（与 `bucketCount` 一致，恒为 7 点） */
export interface MeditationStatisticsChartBlock {
  categories: string[];
  series: MeditationChartSeriesItem[];
}

/** 对比图单指标数据块（上一周期 vs 当前周期） */
export interface MeditationStatisticsCompareMetricBlock {
  series: MeditationChartSeriesItem[];
}

/** `compareChartData`：四个独立对比图共用同一横轴 `categories` */
export interface MeditationStatisticsCompareChartData {
  categories: string[];
  heartRate: MeditationStatisticsCompareMetricBlock;
  breathRate: MeditationStatisticsCompareMetricBlock;
  movement: MeditationStatisticsCompareMetricBlock;
  duration: MeditationStatisticsCompareMetricBlock;
}

/**
 * 整段周期汇总 + 时间范围（`currentPeriod` / `previousPeriod`）。
 * `rangeEnd` 不含，与 SQL `endDate < ?` 语义一致。
 */
export interface MeditationStatisticsPeriodSummary {
  rangeStart: string;
  rangeEnd: string;
  sessionCount: number;
  totalDurationMinutes: number;
  avgHeartRate: number;
  avgBreathRate: number;
  movementCount: number;
  avgMovementPerMinute: number;
  latestSessionId: number;
  /** 最近会话时长（分钟），可为小数，如 `0.12` */
  latestSessionMinutes: number;
}

/** `last7Sessions` 单项 */
export interface MeditationStatisticsLast7SessionItem {
  sessionId: number;
  /** 会话时长（分钟） */
  durationMinutes: number;
  /** 会话开始时间 */
  startDate: string;
}

/**
 * 当前周期 7 等分时间桶之一（与 `durationChartData` / `compareChartData` 横轴对齐）。
 * `week`：`label` 为周一…周日等；`day`：`HH:mm`；`month`：`M/D`。
 */
export interface MeditationStatisticsTrendPoint {
  /** 桶序号 `0..6` */
  index: number;
  label: string;
  rangeStart: string;
  rangeEnd: string;
  totalDurationMinutes: number;
  sessionCount: number;
  avgHeartRate: number;
  avgBreathRate: number;
  movementCount: number;
}

/**
 * `GET /app/meditation/report/statistics` 的 `data`（5.4.2）。
 * `bucketCount` 固定为 7：`trend`、双图均为 7 个等分桶；日/周/月对比轴一致。
 */
export interface MeditationReportStatisticsData {
  range: MeditationStatisticsRange;
  /** 固定为 `7` */
  bucketCount: number;
  currentPeriod: MeditationStatisticsPeriodSummary;
  previousPeriod: MeditationStatisticsPeriodSummary;
  /** 最近会话时长（分钟），可为小数 */
  latestSessionMinutes: number;
  last7SessionsTotalMinutes: number;
  last7Sessions: MeditationStatisticsLast7SessionItem[];
  trend: MeditationStatisticsTrendPoint[];
  durationChartData: MeditationStatisticsChartBlock;
  compareChartData: MeditationStatisticsCompareChartData;
  latestSessionId: number;
}

/** `GET /app/meditation/session/active` 进行中会话摘要 */
export interface MeditationActiveSession {
  sessionId: number;
  sn?: string | null;
  type?: number;
  startDate?: string;
  targetDuration?: number;
  lastActiveTime?: string;
}

/** `GET /app/meditation/session/active` 的 `data` */
export interface MeditationSessionActiveData {
  hasActive: boolean;
  session: MeditationActiveSession | null;
  /** 仅 `hasActive=true` 时建议轮询间隔（毫秒） */
  pollInterval?: number;
}
