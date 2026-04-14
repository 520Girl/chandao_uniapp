/**
 * 排行榜 HTTP（`/app/leaderboard/*`）。
 */
import { get } from "../request";
import type { LeaderboardDurationQuery, LeaderboardScoreQuery } from "@/types/api/leaderboard";

const LEADERBOARD_SCORE_PATH = "/app/leaderboard/score";
const LEADERBOARD_DURATION_PATH = "/app/leaderboard/duration";

/**
 * 综合排行榜分页；需登录。
 *
 * @param query `range` day/week/month/total 默认 week；`teamId` 可选；`page` / `size` 分页
 */
export const fetchLeaderboardScore = (query?: LeaderboardScoreQuery) => {
  return get(LEADERBOARD_SCORE_PATH, query ?? {});
};

/**
 * 总时长排行榜分页；需登录。
 *
 * @param query `range` day/week/month/total 默认 week；`teamId` 传入则仅统计该团队在职成员；`page` / `size` 分页
 */
export const fetchLeaderboardDuration = (query?: LeaderboardDurationQuery) => {
  return get(LEADERBOARD_DURATION_PATH, query ?? {});
};
