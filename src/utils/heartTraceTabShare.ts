/**
 * 心迹 Tab（`pages/index/report`）：微信好友/朋友圈与 H5 链接分享参数。
 */
import type { MeditationStatisticsRange } from "@/types/api/meditation";

const HEART_TRACE_PATH = "/pages/index/report";

/** 微信分享卡片文案用快照 */
export interface HeartTraceWechatSharePayload {
  range: MeditationStatisticsRange;
  rangeLabel: string;
  periodSummaryMinutes: string;
  latestSessionMinutes: string;
}

function buildQueryString(range: MeditationStatisticsRange): string {
  return `range=${encodeURIComponent(range)}`;
}

/**
 * 小程序「分享给好友」。
 * @param p 心迹统计快照
 */
export function buildHeartTraceFriendShare(
  p: HeartTraceWechatSharePayload,
): { title: string; path: string } {
  const qs = buildQueryString(p.range);
  const title = `我的心迹｜本${p.rangeLabel}静坐 ${p.periodSummaryMinutes} 分钟`;
  return { title, path: `${HEART_TRACE_PATH}?${qs}` };
}

/**
 * 小程序「分享到朋友圈」。
 * @param p 心迹统计快照
 */
export function buildHeartTraceTimelineShare(
  p: HeartTraceWechatSharePayload,
): { title: string; query: string } {
  return {
    title: `心迹 · 本${p.rangeLabel} ${p.periodSummaryMinutes} 分钟｜最近一次 ${p.latestSessionMinutes} 分钟`,
    query: buildQueryString(p.range),
  };
}

/**
 * H5 复制链接（需配置 `VITE_H5_SHARE_BASE`）。
 * @param base 站点根 URL
 * @param p 心迹统计快照
 */
export function buildHeartTraceH5Url(base: string, p: HeartTraceWechatSharePayload): string {
  const root = base.replace(/\/$/, "");
  return `${root}/#${HEART_TRACE_PATH}?${buildQueryString(p.range)}`;
}
