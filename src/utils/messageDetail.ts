/**
 * 消息详情：将接口 `MessageInfo` / `contentData` 转为页面展示模型。
 */
import type { MessageInfo } from "@/types/api/message";
import type { MessageDetailView } from "@/types/pages/message";
import { formatRelativeTime } from "@/utils/common";

const SENDER_LABELS: Record<number, string> = {
  0: "系统通知",
  1: "管理员",
  2: "用户",
};

/**
 * 将接口 `contentType` 规范为详情页分支（未知值按纯文本处理）。
 */
export function normalizeMessageContentType(n: unknown): 0 | 1 | 2 | 3 {
  const x = Number(n);
  if (x === 1 || x === 2 || x === 3) return x;
  return 0;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickImageArray(obj: Record<string, unknown>): string[] {
  const arrayKeys = ["images", "imageUrls", "imageList", "pics", "pictureUrls"];
  for (const k of arrayKeys) {
    const v = obj[k];
    if (Array.isArray(v)) {
      const urls = v
        .filter((x): x is string => typeof x === "string" && Boolean(x.trim()))
        .map((s) => s.trim());
      if (urls.length) return urls;
    }
  }
  const single = pickString(obj, ["image", "cover", "coverUrl", "img"]);
  return single ? [single] : [];
}

export interface ParsedMessageContentData {
  images?: string[];
  linkUrl?: string;
  linkTitle?: string;
  senderAvatar?: string;
}

function contentDataAsRecord(raw: MessageInfo["contentData"]): Record<string, unknown> {
  if (raw == null) return {};
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return {};
    try {
      return JSON.parse(s) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

/**
 * 解析 `contentData`（对象或 JSON 字符串），提取图文列表、外链、发送方头像等。
 * 兼容常见字段名变体，以适配后端演进。
 * @param raw 接口 `MessageInfo.contentData`
 */
export function parseMessageContentData(raw: MessageInfo["contentData"]): ParsedMessageContentData {
  const obj = contentDataAsRecord(raw);

  const images = pickImageArray(obj);
  const linkUrl = pickString(obj, ["linkUrl", "url", "href", "link"]);
  const linkTitle = pickString(obj, ["linkTitle", "linkName", "linkText"]);
  const senderAvatar = pickString(obj, ["senderAvatar", "avatar", "headImg", "headUrl"]);

  const out: ParsedMessageContentData = {};
  if (images.length) out.images = images;
  if (linkUrl) out.linkUrl = linkUrl;
  if (linkTitle) out.linkTitle = linkTitle;
  if (senderAvatar) out.senderAvatar = senderAvatar;
  return out;
}

/**
 * 将 `MessageInfo` 映射为详情页 `MessageDetailView`。
 * @param info 接口返回的非空详情
 */
export function messageInfoToDetailView(info: MessageInfo): MessageDetailView {
  const parsed = parseMessageContentData(info.contentData);
  const extra = contentDataAsRecord(info.contentData);
  const st = info.senderType;
  const senderName = SENDER_LABELS[st] ?? "通知";
  const nameFromData = pickString(extra, ["senderName", "nickname", "nickName", "userName"]);
  const timeSrc = info.sendTime || info.createTime;
  return {
    id: info.id,
    contentType: normalizeMessageContentType(info.contentType),
    title: info.title || "通知",
    senderName: nameFromData || senderName,
    senderAvatar: parsed.senderAvatar || "",
    createTimeLabel: formatRelativeTime(timeSrc),
    content: info.content ?? "",
    images: parsed.images,
    linkUrl: parsed.linkUrl,
    linkTitle: parsed.linkTitle,
  };
}
