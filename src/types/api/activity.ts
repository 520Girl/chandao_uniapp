/**
 * 活动模块接口契约（`/app/activity/*`）。
 */

/** POST `/app/activity/page` Body */
export interface ActivityPageQuery {
  /** 页码，默认 1 */
  page?: number;
  /** 每页条数，默认 20 */
  size?: number;
}

/** 活动分页列表单行（后端 raw select 固定字段） */
export interface ActivityPageListItem {
  id: number;
  title: string;
  /** 开始时间，格式以后端为准 */
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
  /** 置顶标记 */
  isTop: number;
  templateId: number;
  teamId?: number | null;
  templateName?: string | null;
  templateIcon?: string | null;
}

/** 通用分页信息（与 Post 流一致） */
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

/** 活动详情中的打卡统计 */
export interface ActivityCheckinStats {
  totalParticipants: number;
  todayCheckinCount: number;
  checkinList: ActivityCheckinListItem[];
}

export interface ActivityCheckinListItem {
  userId: number;
  userName: string;
  checkinDays: number;
  todayChecked: boolean;
}

/** GET `/app/activity/info` 的 data */
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
  templateName?: string | null;
  templateIcon?: string | null;
  checkinStats: ActivityCheckinStats;
}

/** GET `/app/activity/checkinStats` Query */
export interface ActivityCheckinStatsQuery {
  /** 活动 id */
  id: number;
}

/** GET `/app/activity/info` Query */
export interface ActivityInfoQuery {
  id: number;
}

/** POST `/app/activity/join` Body */
export interface ActivityJoinDTO {
  id: number;
}

/** POST `/app/activity/checkin` Body */
export interface ActivityCheckinDTO {
  id: number;
}

/** POST `/app/activity/join` 的 data */
export interface ActivityParticipation {
  id: number;
  userId: number;
  activityId: number;
  applyTime?: string | null;
  status: number;
  /** 后端结构不定，按实际解析 */
  checkins?: unknown[] | null;
  createTime: string;
  updateTime: string;
}
