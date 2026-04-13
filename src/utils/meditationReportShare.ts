/**
 * 冥想报告：微信小程序分享给好友/朋友圈参数、H5 链接、uview-plus 海报 json。
 * 无 HTTP；供页面与 composable 调用。
 */
import type {
  MeditationReportSharePayload,
  UviewPosterJson,
} from "@/types/pages/meditationShare";

const REPORT_PATH = "/pages/meditation/report";

function appendQueryPart(parts: string[], key: string, value: string | number): void {
  parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
}

/**
 * 将分享参数序列化为 query（不含前导 `?`），供 `onShareTimeline` 等使用。
 * 手写拼接以兼容微信小程序 JS 引擎（部分环境无 `URLSearchParams`）。
 * @param p 报告页分享载荷
 */
export function buildMeditationReportShareQueryString(p: MeditationReportSharePayload): string {
  const parts: string[] = [];
  appendQueryPart(parts, "duration", p.durationMin);
  appendQueryPart(parts, "elapsedSec", p.elapsedSec);
  appendQueryPart(parts, "avgHeart", p.avgHeart);
  appendQueryPart(parts, "avgBreath", p.avgBreath);
  appendQueryPart(parts, "maxHeart", p.maxHeart);
  appendQueryPart(parts, "minHeart", p.minHeart);
  appendQueryPart(parts, "manualStop", p.manualStop ? "1" : "0");
  if (p.trackTitle) appendQueryPart(parts, "trackTitle", p.trackTitle);
  if (p.sessionId != null && p.sessionId > 0) appendQueryPart(parts, "sessionId", p.sessionId);
  return parts.join("&");
}

/**
 * 小程序「分享给好友」卡片：`path` 为站内路径 + query。
 * @param p 报告页分享载荷
 */
export function buildMeditationReportFriendShare(
  p: MeditationReportSharePayload,
): { title: string; path: string } {
  const qs = buildMeditationReportShareQueryString(p);
  const title = `我完成了 ${Math.floor(p.elapsedSec / 60)} 分冥想，平均心率 ${p.avgHeart} BPM`;
  return {
    title,
    path: `${REPORT_PATH}?${qs}`,
  };
}

/**
 * 小程序「分享到朋友圈」：`query` 不可带前导 `?`。
 * 可选 `imageUrl`：来自 `p.timelineImageUrl` 或环境变量 `VITE_MP_TIMELINE_SHARE_IMAGE`（须为 HTTPS）。
 * @param p 报告页分享载荷
 */
export function buildMeditationReportTimelineShare(
  p: MeditationReportSharePayload,
): { title: string; query: string; imageUrl?: string } {
  const qs = buildMeditationReportShareQueryString(p);
  const raw = (p.timelineImageUrl ?? import.meta.env.VITE_MP_TIMELINE_SHARE_IMAGE ?? "").trim();
  const out: { title: string; query: string; imageUrl?: string } = {
    title: `冥想 ${Math.floor(p.elapsedSec / 60)} 分钟｜平均心率 ${p.avgHeart} BPM`,
    query: qs,
  };
  if (raw && /^https:\/\//i.test(raw)) {
    out.imageUrl = raw;
  }
  return out;
}

/**
 * 构建 H5 完整分享链接（复制到剪贴板、非微信 JSSDK 场景）。
 * @param base 站点根，如 `https://m.example.com`
 * @param p 报告页分享载荷
 */
export function buildMeditationReportH5Url(
  base: string,
  p: MeditationReportSharePayload,
): string {
  const root = base.replace(/\/$/, "");
  const qs = buildMeditationReportShareQueryString(p);
  return `${root}/#${REPORT_PATH}?${qs}`;
}

function resolvePosterQrText(p: MeditationReportSharePayload): string {
  const qs = buildMeditationReportShareQueryString(p);
  if (p.h5LandingBaseUrl?.trim()) {
    return buildMeditationReportH5Url(p.h5LandingBaseUrl.trim(), p);
  }
  try {
    const plat = uni.getSystemInfoSync().uniPlatform || "";
    if (plat === "web" && typeof window !== "undefined" && window.location?.origin) {
      const path = window.location.pathname || "/";
      return `${window.location.origin}${path}#${REPORT_PATH}?${qs}`;
    }
  } catch {
    /* 非 H5 或 getSystemInfoSync 不可用时走路径文本 */
  }
  return `${REPORT_PATH}?${qs}`;
}

/**
 * 生成 `up-poster` 所需的 `json`（文案 + 底部二维码）。
 * @param p 报告页分享载荷
 */
export function buildMeditationReportPosterJson(p: MeditationReportSharePayload): UviewPosterJson {
  const minutes = Math.floor(p.elapsedSec / 60);
  const sec = p.elapsedSec % 60;
  const qrText = resolvePosterQrText(p);
  return {
    css: {
      width: "750rpx",
      height: "1180rpx",
      background: "#f7f3eb",
    },
    views: [
      {
        type: "view",
        css: {
          left: "48rpx",
          top: "48rpx",
          width: "654rpx",
          height: "200rpx",
          background: "#ffffff",
          radius: "24rpx",
        },
      },
      {
        type: "text",
        text: "禅修报告",
        css: {
          left: "72rpx",
          top: "88rpx",
          color: "#5c4d2c",
          fontSize: "44rpx",
          fontWeight: "bold",
        },
      },
      {
        type: "text",
        text: `本次 ${minutes} 分 ${sec} 秒 · 平均心率 ${p.avgHeart} bpm`,
        css: {
          left: "72rpx",
          top: "168rpx",
          color: "#6b6354",
          fontSize: "28rpx",
        },
      },
      {
        type: "text",
        text: `平均呼吸 ${p.avgBreath} 次/分`,
        css: {
          left: "72rpx",
          top: "220rpx",
          color: "#6b6354",
          fontSize: "28rpx",
        },
      },
      {
        type: "text",
        text: "长按或扫码查看详情",
        css: {
          left: "72rpx",
          top: "980rpx",
          color: "#9a8f7a",
          fontSize: "24rpx",
        },
      },
      {
        type: "qrcode",
        text: qrText,
        css: {
          left: "255rpx",
          top: "720rpx",
          width: "240rpx",
          height: "240rpx",
        },
      },
    ],
  };
}
