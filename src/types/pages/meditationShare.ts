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
   * 分享令牌（`POST shareToken`）；小程序好友/朋友圈与 H5 链接优先带 `token` 落地分享页。
   */
  shareToken?: string | null;
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
  /**
   * 海报主标题；默认「心迹报告」。团队/个人邀请海报可传「团队邀请」「个人成团邀请」等。
   */
  posterMainTitle?: string;
  /**
   * 海报二维码上方的说明；默认「长按图片可保存 · 扫码查看完整报告」。
   */
  posterBottomHint?: string;
  /**
   * 海报底部二维码内容：未配置 `posterBottomQrImageUrl` 时由 `up-poster` 生成二维码。
   * 邀请场景一般为 H5 落地 `/pages/index/join?inviteCode=` 或小程序路径形式。
   */
  posterBottomQrText?: string | null;
  /**
   * 海报底部优先展示的网络图（如 `createTeamInvite` / `createPersonalInvite` 返回的 `miniProgramQrUrl`）；
   * 非空时不再绘制「报告页」二维码。
   */
  posterBottomQrImageUrl?: string | null;
  /**
   * 为 `true` 时使用「纯邀请」版式：不展示心率、呼吸、时长等冥想数据，仅标题、副文案、提示与二维码。
   */
  posterInviteMinimal?: boolean;
  /** `posterInviteMinimal` 时主标题下的说明行（如社群名称），不传则不画该行 */
  posterInviteSubtitle?: string;
  /** 报告海报：用户昵称（展示在头像旁） */
  posterUserName?: string;
  /** 报告海报：用户头像 URL（可为本地路径、绝对 URL） */
  posterUserAvatarUrl?: string;
  /** 报告海报：累计冥想天数 */
  posterTotalDays?: number | null;
  /** 报告海报：累计冥想时长（小时） */
  posterTotalHours?: number | null;
  /** 报告海报：连续冥想天数 */
  posterConsecutiveDays?: number | null;
  /** 报告海报：本次体动次数 */
  posterMovementCount?: number | null;
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

export interface UviewPosterViewImage {
  type: "image";
  /** 网络或本地路径；小程序需将图片域名加入下载白名单 */
  src: string;
  css?: Record<string, string | number | undefined>;
}

export type UviewPosterView =
  | UviewPosterViewText
  | UviewPosterViewRect
  | UviewPosterViewQrcode
  | UviewPosterViewImage;

/** `up-poster` 的 `json` prop 结构 */
export interface UviewPosterJson {
  css: UviewPosterCss;
  views: UviewPosterView[];
}
