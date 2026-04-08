/**
 * 活动模块 HTTP（分页、详情、打卡、参加等）。
 */
import { get, post } from "../request";
import type {
  ActivityCheckinDTO,
  ActivityCheckinStatsQuery,
  ActivityInfoQuery,
  ActivityJoinDTO,
  ActivityPageQuery,
} from "@/types/api/activity";

const ACTIVITY_PAGE_PATH = "/app/activity/page";
const ACTIVITY_INFO_PATH = "/app/activity/info";
const ACTIVITY_CHECKIN_STATS_PATH = "/app/activity/checkinStats";
const ACTIVITY_JOIN_PATH = "/app/activity/join";
const ACTIVITY_CHECKIN_PATH = "/app/activity/checkin";

/**
 * 活动分页列表；需登录。
 *
 * @param body `page` / `size`
 */
export const fetchActivityPage = (body?: ActivityPageQuery) => {
  return post(ACTIVITY_PAGE_PATH, body ?? {});
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
 * 活动打卡统计（可与详情中的 `checkinStats` 结构一致）；需登录。
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
 * @param body `id` 活动主键
 */
export const postActivityCheckin = (body: ActivityCheckinDTO) => {
  return post(ACTIVITY_CHECKIN_PATH, body);
};
