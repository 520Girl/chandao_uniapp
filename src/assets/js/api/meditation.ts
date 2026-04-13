/**
 * 用户端冥想：开始会话、轮询状态、结束并拉取报告（`/app/meditation/*`）。
 */
import { get, post } from "../request";
import type {
  MeditationEndDTO,
  MeditationPollDTO,
  MeditationReportStatisticsQuery,
  MeditationStartDTO,
} from "@/types/api/meditation";

const MEDITATION_START = "/app/meditation/start";
const MEDITATION_POLL = "/app/meditation/poll";
const MEDITATION_END = "/app/meditation/end";
const MEDITATION_REPORT_DETAIL = "/app/meditation/report/detail";
const MEDITATION_REPORT_STATISTICS = "/app/meditation/report/statistics";

/**
 * 开始冥想（设备 / 无设备）；需登录。
 *
 * @param body `type`+`sn`（设备必填 SN）、`targetDuration`（分钟）
 * @returns 业务包，`data` 为 `MeditationStartResult`（含 `sessionId`、`pollInterval`）
 */
export const startMeditation = (body: MeditationStartDTO) => {
  return post(MEDITATION_START, body);
};

/**
 * 轮询冥想状态与实时生理数据；需登录。按开始接口返回的 `pollInterval` 调用。
 *
 * @param body `sessionId` 可选，不传则由后端解析当前进行中会话
 * @returns 业务包，`data` 为进行中或已结束结构（见 `MeditationPollOngoing` / `MeditationPollEnded`）
 */
export const pollMeditation = (body?: MeditationPollDTO) => {
  return post(MEDITATION_POLL, body ?? {});
};

/**
 * 结束冥想；需登录。完整报告请再调 `fetchMeditationReportDetail`。
 *
 * @param body `sessionId` 必填
 * @returns 业务包，`data` 为 `MeditationEndResult`
 */
export const endMeditation = (body: MeditationEndDTO) => {
  return post(MEDITATION_END, body);
};

/**
 * 某次冥想报告详情；需登录。
 *
 * @param query `sessionId` 必填
 * @returns 业务包，`data` 为 `MeditationReport` 或 `null`
 */
export const fetchMeditationReportDetail = (query: { sessionId: number }) => {
  return get(MEDITATION_REPORT_DETAIL, query);
};

/**
 * 冥想统计对比（5.4.2）；需登录。`bucketCount=7`，`trend`/双图均为 7 等分桶；含 `currentPeriod`/`previousPeriod` 整段汇总。
 *
 * @param query `range`：`day` | `week` | `month`，缺省由后端处理（一般为 `week`）
 * @returns 业务包，`data` 为 `MeditationReportStatisticsData`
 */
export const fetchMeditationReportStatistics = (query?: MeditationReportStatisticsQuery) => {
  return get(MEDITATION_REPORT_STATISTICS, query ?? {});
};
