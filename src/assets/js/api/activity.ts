/**
 * 活动模块 HTTP（`/app/activity/*`）：分页、详情、打卡统计、参加、打卡。
 */
import { get, post } from "../request";
import type {
  ActivityCheckinDTO,
  ActivityCheckinStatsQuery,
  ActivityCreateFromTemplateBody,
  ActivityInfoQuery,
  ActivityJoinDTO,
  ActivityPageQuery,
  ActivityReadyDTO,
  ActivityRoomResultQuery,
  ActivityRoomStateQuery,
} from "@/types/api/activity";

const ACTIVITY_PAGE_PATH = "/app/activity/page";
const ACTIVITY_TEMPLATES_PATH = "/app/activity/templates";
const ACTIVITY_CREATE_FROM_TEMPLATE_PATH = "/app/activity/createFromTemplate";
const ACTIVITY_INFO_PATH = "/app/activity/info";
const ACTIVITY_CHECKIN_STATS_PATH = "/app/activity/checkinStats";
const ACTIVITY_JOIN_PATH = "/app/activity/join";
const ACTIVITY_CHECKIN_PATH = "/app/activity/checkin";
const ACTIVITY_READY_PATH = "/app/activity/ready";
const ACTIVITY_SERVER_TIME_PATH = "/app/activity/serverTime";
const ACTIVITY_ROOM_STATE_PATH = "/app/activity/roomState";
const ACTIVITY_ROOM_RESULT_PATH = "/app/activity/roomResult";

/**
 * 活动分页列表（GET，与 8.1 文档一致）；需登录。
 *
 * @param query `page` / `size` / `teamId` / `includeExpired` / `onlyJoined`（`0` 活动广场展示全部并带 `isJoined`）
 */
export const fetchActivityPageGet = (query?: ActivityPageQuery) => {
  return get(ACTIVITY_PAGE_PATH, query ?? {});
};

/**
 * 活动分页列表（POST，兼容旧客户端）；需登录。Body 与 `fetchActivityPageGet` 的 Query 相同。
 */
export const fetchActivityPage = (body?: ActivityPageQuery) => {
  return post(ACTIVITY_PAGE_PATH, body ?? {});
};

/**
 * 可团队发布的活动模板列表；需登录。仅 `allowTeamPublish=是` 的模板。
 */
export const fetchActivityTemplates = () => {
  return get(ACTIVITY_TEMPLATES_PATH);
};

/**
 * 团队负责人从模板创建本团队活动；需登录。`teamId` 须为当前用户负责的团队。
 * `status` 为 number（`1` 草稿 / `2` 发布）；发布时 `startDate`/`endDate` 与 `sessionConfig.scheduled*` 宜为 ISO 8601。
 * `sessionConfig` 须为 object（普通活动可传 `{}`）。
 */
export const postActivityCreateFromTemplate = (body: ActivityCreateFromTemplateBody) => {
  return post(ACTIVITY_CREATE_FROM_TEMPLATE_PATH, body);
};

/**
 * 活动详情；需登录。
 *
 * @param query `id` 活动主键
 */
export const fetchActivityDetail = (query: ActivityInfoQuery) => {
  return get(ACTIVITY_INFO_PATH, query);
};

/**
 * 活动打卡统计；需登录。返回结构与详情中 `checkinStats` 一致。
 *
 * @param query `id` 活动主键
 */
export const fetchActivityCheckinStats = (query: ActivityCheckinStatsQuery) => {
  return get(ACTIVITY_CHECKIN_STATS_PATH, query);
};

/**
 * 参加活动；需登录。
 *
 * @param body `id` 活动主键
 */
export const postActivityJoin = (body: ActivityJoinDTO) => {
  return post(ACTIVITY_JOIN_PATH, body);
};

/**
 * 活动打卡；成功后业务 `data` 为 `null`；需登录。
 *
 * @param body `id` 必填；`lat`/`lng`/`accuracy` 线下活动建议上报；`province`/`city` 可选展示字段
 */
export const postActivityCheckin = (body: ActivityCheckinDTO) => {
  return post(ACTIVITY_CHECKIN_PATH, body);
};

/**
 * 多人共修设置就绪；需登录。仅 `activityType=2`；开场后不可改；未报名会先报名。
 *
 * @param body `id` 活动 ID，`ready` `1` 就绪 / `0` 取消
 */
export const postActivityReady = (body: ActivityReadyDTO) => {
  return post(ACTIVITY_READY_PATH, body);
};

/**
 * 服务端当前毫秒时间戳；**无需登录**。用于与 `roomState` 倒计时交叉校正。
 */
export const fetchActivityServerTime = () => {
  return get(ACTIVITY_SERVER_TIME_PATH);
};

/**
 * 多人共修房间状态；需登录。建议 10～30s 轮询。
 *
 * @param query `id` 活动 ID
 */
export const fetchActivityRoomState = (query: ActivityRoomStateQuery) => {
  const id = encodeURIComponent(String(query.id));
  return get(`${ACTIVITY_ROOM_STATE_PATH}?id=${id}`);
};

/**
 * 多人共修房间排行榜结果；需登录。结算后或进行中均可查（以后端为准）。
 *
 * @param query `id` 活动 ID
 */
export const fetchActivityRoomResult = (query: ActivityRoomResultQuery) => {
  const id = encodeURIComponent(String(query.id));
  return get(`${ACTIVITY_ROOM_RESULT_PATH}?id=${id}`);
};
