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
} from "@/types/api/activity";

const ACTIVITY_PAGE_PATH = "/app/activity/page";
const ACTIVITY_TEMPLATES_PATH = "/app/activity/templates";
const ACTIVITY_CREATE_FROM_TEMPLATE_PATH = "/app/activity/createFromTemplate";
const ACTIVITY_INFO_PATH = "/app/activity/info";
const ACTIVITY_CHECKIN_STATS_PATH = "/app/activity/checkinStats";
const ACTIVITY_JOIN_PATH = "/app/activity/join";
const ACTIVITY_CHECKIN_PATH = "/app/activity/checkin";

/**
 * 活动分页列表（GET，与 8.1 文档一致）；需登录。
 *
 * @param query `page` 默认 1，`size` 默认 20 最大 100；`teamId` 可选
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
