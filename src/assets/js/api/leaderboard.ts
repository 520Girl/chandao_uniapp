/**
 * 排行榜 HTTP（`/app/leaderboard/*`）。
 */
import { get } from "../request";
import type { LeaderboardScoreQuery } from "@/types/api/leaderboard";

const LEADERBOARD_SCORE_PATH = "/app/leaderboard/score";

/**
 * 综合排行榜分页；需登录。
 *
 * @param query `range` day/week/month/total 默认 week；`teamId` 可选；`page` / `size` 分页
 */
export const fetchLeaderboardScore = (query?: LeaderboardScoreQuery) => {
  return get(LEADERBOARD_SCORE_PATH, query ?? {});
};
