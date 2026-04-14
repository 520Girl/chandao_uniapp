/**
 * 排行榜 `/app/leaderboard/*` 接口契约。
 */

/** GET `/app/leaderboard/score` Query：`range` */
export type LeaderboardRange = "day" | "week" | "month" | "total";

/** GET `/app/leaderboard/score` Query */
export interface LeaderboardScoreQuery {
  range?: LeaderboardRange;
  /** 传入则仅统计该团队在职成员 */
  teamId?: number | null;
  page?: number;
  /** 默认 20，最大 100 */
  size?: number;
}

/** 综合榜单项 */
export interface LeaderboardScoreItem {
  userId: number;
  nickName?: string | null;
  avatarUrl?: string | null;
  lastProvince?: string | null;
  lastCity?: string | null;
  likes: number;
  postCount: number;
  checkins: number;
  reportCount: number;
  minutes: number;
  lastMeditationTime?: string | null;
  /** 综合分（后端公式） */
  score: number;
}

/** 当前统计周期说明 */
export interface LeaderboardRangeMeta {
  range: string;
  start: string;
  end: string;
}

/** GET `/app/leaderboard/score` 的 data */
export interface LeaderboardScorePage {
  list: LeaderboardScoreItem[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
  range: LeaderboardRangeMeta;
}

/** GET `/app/leaderboard/duration` Query：参数与 score 列表一致 */
export type LeaderboardDurationQuery = LeaderboardScoreQuery;

/** 总时长榜单项（某时间范围内的冥想时长统计） */
export interface LeaderboardDurationItem {
  userId: number;
  nickName?: string | null;
  avatarUrl?: string | null;
  lastProvince?: string | null;
  lastCity?: string | null;
  /** 该时间范围内报告数 */
  reportCount: number;
  /** 该时间范围内冥想分钟 */
  minutes: number;
  /** 该时间范围内冥想小时 */
  hours: number;
  /** 该时间范围内冥想秒（用于排序） */
  seconds: number;
  /** 最近一次禅修结束时间 */
  lastMeditationTime?: string | null;
}

/** GET `/app/leaderboard/duration` 的 data */
export interface LeaderboardDurationPage {
  list: LeaderboardDurationItem[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
  range: LeaderboardRangeMeta;
}
