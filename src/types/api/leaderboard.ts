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
