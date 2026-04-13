/**
 * 冥想报告页：分享给好友/朋友圈、海报（up-poster）等前端视图模型。
 * 由 `report.vue` 从接口与 ref 映射后传入 `buildMeditationReport*` 系列方法。
 */

/** 报告页分享与海报生成所需字段 */
export interface MeditationReportSharePayload {
  /** 目标时长（分钟） */
  durationMin: number;
  /** 本次已进行秒数 */
  elapsedSec: number;
  avgHeart: number;
  avgBreath: number;
  maxHeart: number;
  minHeart: number;
  /** 是否手动结束 */
  manualStop: boolean;
  /** 曲目标题（可为空） */
  trackTitle: string;
  /** 服务端会话 ID；无则仅带统计参数 */
  sessionId: number | null;
  /**
   * H5 落地根地址（含协议、无尾斜杠），用于海报二维码内容；
   * 未配置时小程序端用「路径+query」文本，H5 端用当前 `location.origin`（仅浏览器）。
   */
  h5LandingBaseUrl?: string;
  /**
   * 仅微信小程序 `onShareTimeline`：自定义分享图 `imageUrl`（须为 **HTTPS** 网络地址，规则以微信文档为准）。
   * 不填时可在构建环境配置 `VITE_MP_TIMELINE_SHARE_IMAGE`。
   */
  timelineImageUrl?: string;
}

/** uview-plus `up-poster` 根节点样式（与官方 poster json 对齐） */
export interface UviewPosterCss {
  width?: string;
  height?: string;
  background?: string;
}

export interface UviewPosterViewText {
  type: "text";
  text: string;
  css?: Record<string, string | number | undefined>;
}

export interface UviewPosterViewRect {
  type: "view";
  css?: Record<string, string | number | undefined>;
}

export interface UviewPosterViewQrcode {
  type: "qrcode";
  /** 二维码编码内容（URL 或小程序路径+query） */
  text: string;
  css?: Record<string, string | number | undefined>;
}

export type UviewPosterView = UviewPosterViewText | UviewPosterViewRect | UviewPosterViewQrcode;

/** `up-poster` 的 `json` prop 结构 */
export interface UviewPosterJson {
  css: UviewPosterCss;
  views: UviewPosterView[];
}
