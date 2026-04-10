/**
 * 消息中心接口类型契约。
 */

/** POST `/app/message/page` */
export interface MessagePageDTO {
  /** 页码，默认 1 */
  page?: number;
  /** 每页条数，默认 20 */
  size?: number;
  /** 已读状态：0-未读 1-已读 */
  readStatus?: number;
  /** 发送者类型：0-系统 1-管理员 2-用户 */
  senderType?: number;
}

/** 消息分页列表行（后端 select 固定字段） */
export interface MessageListItem {
  id: number;
  title: string;
  content?: string;
  /** 0 纯文本 1 图文 2 图文链接 3 文本链接 */
  contentType: number;
  contentData?: Record<string, unknown> | string | null;
  templateKey?: string | null;
  bizType?: string | null;
  bizId?: number | null;
  targetType: number;
  teamId?: number | null;
  sendTime: string;
  createTime: string;
  /** 0 未读 1 已读 */
  readStatus: number;
  readTime?: string | null;
}

/**
 * GET `/app/message/info` 的 `data`（单条详情，可能为 `null`）。
 * `contentData` 为结构化扩展（多为 JSON 对象），用于图文 URL、外链等。
 */
export interface MessageInfo {
  id: number;
  title: string;
  content?: string;
  /** 0 纯文本 1 图文 2 图文链接 3 文本链接 */
  contentType: number;
  contentData?: Record<string, unknown> | string | null;
  templateKey?: string | null;
  bizType?: string | null;
  bizId?: number | null;
  /** 投递范围：0 全体 1 指定用户 2 团队成员 3 团队负责人 */
  targetType: number;
  teamId?: number | null;
  /** 发送者类型：0 系统 1 管理员 2 用户 */
  senderType: number;
  senderId?: number | null;
  /** 发送时间（ISO 或后端约定格式） */
  sendTime: string;
  createTime: string;
  /** 0 未读 1 已读 */
  readStatus: number;
  readTime?: string | null;
}

/** 分页 data 结构 */
export interface MessagePage {
  list: MessageListItem[];
  pagination?: {
    page?: number;
    size?: number;
    total?: number;
  };
}

/** GET `/app/message/unread-count` 的 data */
export interface MessageUnreadCount {
  data: number;
}

export interface MessageReadDTO {
  messageId: number;
}

export interface MessageDeleteDTO {
  messageId?: number;
  ids?: number[];
}

export interface MessageActionDTO {
  messageId: number;
  bizType?: string;
  bizId?: number;
}

export interface MessageActionResult {
  handled: boolean;
  reason?: string;
  bizType?: string;
  bizId?: number;
}