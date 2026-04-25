/**
 * 总时长榜接口项 `LeaderboardDurationItem` 的展示/排序辅助；无 HTTP。
 */
import type { LeaderboardDurationItem } from "@/types/api/leaderboard";

/**
 * 从榜单项取「该周期冥想分钟数」。缺省或非法时返回 0，与「无时长仍入榜、计 0」的约定一致。
 * 按优先级：`minutes` → `seconds/60` → `hours*60`。
 */
export function leaderboardItemDurationMinutes(item: LeaderboardDurationItem): number {
  const m = item.minutes;
  if (m != null && Number.isFinite(Number(m)) && Number(m) >= 0) return Number(m);
  const sec = item.seconds;
  if (sec != null && Number.isFinite(Number(sec)) && Number(sec) >= 0) return Number(sec) / 60;
  const h = item.hours;
  if (h != null && Number.isFinite(Number(h)) && Number(h) >= 0) return Number(h) * 60;
  return 0;
}
