/**
 * 冥想报告：微信小程序分享给好友/朋友圈参数、H5 链接、uview-plus 海报 json。
 * 无 HTTP；供页面与 composable 调用。海报底层背景图由 `VITE_MEDITATION_REPORT_POSTER_BG_URL` 配置（有默认）。
 * 海报配色：白底 + 主题金点缀，正文深灰保证对比度。
 */
import type {
  MeditationReportSharePayload,
  UviewPosterJson,
} from "@/types/pages/meditationShare";

const REPORT_PATH = "/pages/meditation/report";
/** 免登录分享落地页（与微信分享 path 一致） */
const REPORT_SHARE_PATH = "/pages/meditation/report-share";

function appendShareTokenQuery(parts: string[], token: string): void {
  appendQueryPart(parts, "token", token);
}

/**
 * 小程序分享 path / H5 hash 路径（优先 `shareToken`）。
 */
export function buildMeditationReportShareLandingPath(p: MeditationReportSharePayload): string {
  const token = p.shareToken?.trim();
  if (token) {
    return `${REPORT_SHARE_PATH}?token=${encodeURIComponent(token)}`;
  }
  const qs = buildMeditationReportShareQueryString(p);
  return `${REPORT_PATH}?${qs}`;
}

/** 画布与主底 */
const C_BG = "#ffffff";
/** 与项目 Tailwind `primary` 一致（顶栏、强调线） */
const C_PRIMARY = "#c9a227";
const C_PRIMARY_SOFT = "rgba(201, 162, 39, 0.28)";
const C_INK = "#111827";
const C_TEXT = "#1f2937";
const C_TEXT_MUTED = "#4b5563";
const C_HINT = "#6b7280";
/** 信息区略浅于底，与白底区分层次 */
const C_CARD = "#f9fafb";

/** 未配置 `VITE_MEDITATION_REPORT_POSTER_BG_URL` 时的海报底图（与历史线上一致） */
const DEFAULT_MEDITATION_REPORT_POSTER_BG_URL =
  "https://jingzuoguanzhao.cn/upload/20260507/MeditationReportBg_8044121041bb4cd2883ea4dc19e27100.jpg";

function resolveMeditationReportPosterBackgroundSrc(): string {
  const v = (import.meta.env.VITE_MEDITATION_REPORT_POSTER_BG_URL || "").trim();
  return v.length > 0 ? v : DEFAULT_MEDITATION_REPORT_POSTER_BG_URL;
}

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
  const title = `我完成了 ${Math.floor(p.elapsedSec / 60)} 分冥想，平均心率 ${p.avgHeart} BPM`;
  return {
    title,
    path: buildMeditationReportShareLandingPath(p),
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
  const token = p.shareToken?.trim();
  const qs = token
    ? (() => {
        const parts: string[] = [];
        appendShareTokenQuery(parts, token);
        return parts.join("&");
      })()
    : buildMeditationReportShareQueryString(p);
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
  const landing = buildMeditationReportShareLandingPath(p);
  return `${root}/#${landing}`;
}

const JOIN_PATH = "/pages/index/join";

/**
 * 邀请码在海报二维码中的文本：优先 H5 根 + hash 落地 join；无 `h5Base` 时用小程序路径 + query。
 *
 * @param inviteCode 后端邀请 `code`
 * @param h5Base 可选，如 `https://m.example.com`（无尾斜杠），来自 `VITE_H5_SHARE_BASE`
 */
export function buildJoinInvitePosterQrText(inviteCode: string, h5Base?: string): string {
  const code = inviteCode.trim();
  if (!code) return "";
  const root = h5Base?.trim().replace(/\/$/, "");
  if (root) {
    return `${root}/#${JOIN_PATH}?inviteCode=${encodeURIComponent(code)}`;
  }
  return `${JOIN_PATH}?inviteCode=${encodeURIComponent(code)}`;
}

function resolvePosterQrText(p: MeditationReportSharePayload): string {
  if (p.h5LandingBaseUrl?.trim()) {
    return buildMeditationReportH5Url(p.h5LandingBaseUrl.trim(), p);
  }
  const landing = buildMeditationReportShareLandingPath(p);
  try {
    const plat = uni.getSystemInfoSync().uniPlatform || "";
    if (plat === "web" && typeof window !== "undefined" && window.location?.origin) {
      const path = window.location.pathname || "/";
      return `${window.location.origin}${path}#${landing.replace(/^\//, "")}`;
    }
  } catch {
    /* 非 H5 或 getSystemInfoSync 不可用时走路径文本 */
  }
  return landing.startsWith("/") ? landing : `/${landing}`;
}

function truncateTrackTitle(title: string, maxLen: number): string {
  const t = title.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
}

function resolvePosterQrBlock(p: MeditationReportSharePayload): {
  qrImageSrc: string;
  qrText: string;
} {
  const qrImageSrc = p.posterBottomQrImageUrl?.trim() || "";
  const qrTextOverride = p.posterBottomQrText != null ? String(p.posterBottomQrText).trim() : "";
  const qrText =
    qrImageSrc.length > 0
      ? ""
      : qrTextOverride.length > 0
        ? qrTextOverride
        : resolvePosterQrText(p);
  return { qrImageSrc, qrText };
}

/**
 * 成员页等：仅标题、副文案、扫码提示与二维码（无冥想指标）。
 */
function buildInviteMinimalPosterJson(p: MeditationReportSharePayload): UviewPosterJson {
  const { qrImageSrc, qrText } = resolvePosterQrBlock(p);
  const mainTitle = (p.posterMainTitle ?? "邀请").trim() || "邀请";
  const bottomHint =
    (p.posterBottomHint ?? "长按图片可保存 · 扫码加入").trim() || "长按图片可保存 · 扫码加入";
  const sub = (p.posterInviteSubtitle ?? "").trim();

  const views: UviewPosterJson["views"] = [
    {
      type: "view",
      css: {
        left: "0rpx",
        top: "0rpx",
        width: "750rpx",
        height: "10rpx",
        background: C_PRIMARY,
      },
    },
    {
      type: "view",
      css: {
        left: "48rpx",
        top: "72rpx",
        width: "654rpx",
        height: "520rpx",
        background: C_CARD,
        radius: "28rpx",
      },
    },
    {
      type: "view",
      css: {
        left: "80rpx",
        top: "112rpx",
        width: "96rpx",
        height: "8rpx",
        background: C_PRIMARY,
      },
    },
    {
      type: "text",
      text: mainTitle,
      css: {
        left: "80rpx",
        top: "144rpx",
        color: C_INK,
        fontSize: "52rpx",
        fontWeight: "bold",
      },
    },
  ];

  let nextTop = 228;
  if (sub) {
    views.push({
      type: "text",
      text: truncateTrackTitle(sub, 36),
      css: {
        left: "80rpx",
        top: `${nextTop}rpx`,
        color: C_TEXT,
        fontSize: "28rpx",
      },
    });
    nextTop += 72;
  }

  views.push(
    {
      type: "view",
      css: {
        left: "80rpx",
        top: `${nextTop}rpx`,
        width: "590rpx",
        height: "6rpx",
        background: C_PRIMARY_SOFT,
      },
    },
    {
      type: "text",
      text: bottomHint,
      css: {
        left: "80rpx",
        top: `${nextTop + 28}rpx`,
        color: C_HINT,
        fontSize: "24rpx",
      },
    },
    qrImageSrc
      ? {
          type: "image",
          src: qrImageSrc,
          css: {
            left: "255rpx",
            top: "420rpx",
            width: "240rpx",
            height: "240rpx",
          },
        }
      : {
          type: "qrcode",
          text: qrText,
          css: {
            left: "255rpx",
            top: "420rpx",
            width: "240rpx",
            height: "240rpx",
          },
        },
    {
      type: "text",
      text: "—— 静心共修 · 同频同行 ——",
      css: {
        left: "160rpx",
        top: "720rpx",
        color: C_HINT,
        fontSize: "22rpx",
      },
    },
  );

  return {
    css: {
      width: "750rpx",
      height: "820rpx",
      background: C_BG,
    },
    views,
  };
}

/**
 * 生成 `up-poster` 所需的 `json`（文案 + 底部二维码）。
 * 尺寸 750×1200rpx，元素坐标均在画布内；白底与浅灰信息卡、金色点缀。
 * @param p 报告页分享载荷
 */
export function buildMeditationReportPosterJson(p: MeditationReportSharePayload): UviewPosterJson {
  if (p.posterInviteMinimal) {
    return buildInviteMinimalPosterJson(p);
  }

  const minutes = Math.floor(p.elapsedSec / 60);
  const sec = p.elapsedSec % 60;
  const { qrImageSrc, qrText } = resolvePosterQrBlock(p);
  const mainTitle = (p.posterMainTitle ?? "坐观其心").trim() || "坐观其心";
  const bottomHint =
    (p.posterBottomHint ?? "长按图片可保存 · 扫码查看完整报告").trim() ||
    "长按图片可保存 · 扫码查看完整报告";
  const userName = (p.posterUserName ?? "静心用户").trim() || "静心用户";
  const avatar = (p.posterUserAvatarUrl ?? "").trim() || "/static/logo.png";
  const todayLine = `${minutes}分${sec}秒`;
  const totalDaysLine = p.posterTotalDays != null ? `${Math.max(0, Math.floor(p.posterTotalDays))} 天` : "--";
  const totalHoursLine =
    p.posterTotalHours != null ? `${Math.max(0, Number(p.posterTotalHours)).toFixed(1)} 小时 ` : "--";
  const progressLine =
    p.posterConsecutiveDays != null
      ? `已连续 ${Math.max(0, Math.floor(p.posterConsecutiveDays))} 天`
      : p.manualStop
        ? "手动收束"
        : "自然收束";
  const movementLine =
    p.posterMovementCount != null ? `${Math.max(0, Math.floor(p.posterMovementCount))} 次` : "--";
  const dateLine = (() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    // return `${d.getFullYear()}/${m}/${day}`;
    return `${m}月${day}日`;
  })();
  const track = p.trackTitle?.trim();
  const trackLine = track ? `伴乐：${truncateTrackTitle(track, 16)}` : "";
  const posterBgSrc = resolveMeditationReportPosterBackgroundSrc();
  const views: UviewPosterJson["views"] = [
    {
      type: "image",
      src: posterBgSrc,
      css: {
        left: "0rpx",
        top: "0rpx",
        width: "750rpx",
        height: "1333rpx",
      },
    },
    {
      type: "image",
      src: avatar,
      css: {
        left: "64rpx",
        top: "64rpx",
        width: "88rpx",
        height: "88rpx",
        radius: "44rpx",
      },
    },
    {
      type: "text",
      text: userName,
      css: {
        left: "176rpx",
        top: "110rpx",
        color: "#2b2518",
        fontSize: "30rpx",
        fontWeight: "bold",
      },
    },
    {
      type: "text",
      text: dateLine,
      css: {
        left: "450rpx",
        top: "120rpx",
        color: "#8e6b35",
        fontSize: "40rpx",
        fontWeight: 'bold'
      },
    },
    {
      type: "text",
      text: progressLine,
      css: {
        left: "220rpx",
        top: "298rpx",
        color: "#3f5246",
        fontWeight: 'bold',
        fontSize: "34rpx",
      },
    },
    {
      type: "text",
      text: totalDaysLine,
      css: {
        left: "220rpx",
        top: "373rpx",
        color: "#2f281b",
        fontWeight: 'bold',
        fontSize: "34rpx",
      },
    },
    {
      type: "text",
      text: totalHoursLine,
      css: {
        left: "220rpx",
        top: "448rpx",
        color: "#2f281b",
        fontWeight: 'bold',
        fontSize: "34rpx",
      },
    },
    {
      type: "text",
      text: todayLine,
      css: {
        left: "220rpx",
        top: "523rpx",
        color: "#2f281b",
        fontWeight: 'bold',
        fontSize: "34rpx",
      },
    },
    {
      type: "text",
      text: `${p.avgHeart} bpm`,
      css: {
        left: "178rpx",
        top: "693rpx",
        color: "#2f281b",
        fontWeight: 'bold',
        fontSize: "34rpx",
      },
    },
      {
      type: "text",
      text: `${p.avgBreath} 次/分`,
      css: {
        left: "194rpx",
        top: "754rpx",
        color: "#2f281b",
        fontWeight: 'bold',
        fontSize: "34rpx",
      },
    },
    {
      type: "text",
      text: movementLine,
      css: {
        left: "178rpx",
        top: "816rpx",
        color: "#2f281b",
        fontSize: "34rpx",
      },
    },
  
  ];

  if (trackLine) {
    views.push({
      type: "text",
      text: trackLine,
      css: {
        left: "272rpx",
        top: "1164rpx",
        color: "#6e6045",
        fontSize: "22rpx",
      },
    });
  }

  views.push(
    qrImageSrc
      ? {
          type: "image",
          src: qrImageSrc,
          css: {
            left: "100rpx",
            top: "1062rpx",
            width: "136rpx",
            height: "136rpx",
            radius: "10rpx",
          },
        }
      : {
          type: "qrcode",
          text: qrText,
          css: {
            left: "110rpx",
            top: "1025rpx",
            width: "136rpx",
            height: "136rpx",
          },
        },
    {
      type: "text",
      text: mainTitle,
      css: {
        left: "272rpx",
        top: "1045rpx",
        color: "#3f3320",
        fontSize: "30rpx",
        fontWeight: "bold",
      },
    },
    {
      type: "text",
      text: bottomHint,
      css: {
        left: "272rpx",
        top: "1090rpx",
        color: "#6e6045",
        fontSize: "20rpx",
      },
    },
    {
      type: "text",
      text: "温馨提示：本报告仅供静心参考，非医疗诊断",
      css: {
        left: "272rpx",
        top: "1125rpx",
        color: "#8d8067",
        fontSize: "18rpx",
      },
    },
  );

  return {
    css: {
      width: "750rpx",
      height: "1333rpx",
      background: "#f2f0e6",
    },
    views,
  };
}
