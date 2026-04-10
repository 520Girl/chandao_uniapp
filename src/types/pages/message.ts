/**
 * 消息详情页视图模型（与列表 `MessageListItem.contentType` / `contentData` 对应，供详情展示与 mock）。
 *
 * contentType：0 纯文本 · 1 图文 · 2 图文链接 · 3 文本链接
 */
export interface MessageDetailView {
  id: number;
  /** 0 纯文本 1 图文 2 图文链接 3 文本链接 */
  contentType: 0 | 1 | 2 | 3;
  title: string;
  senderName: string;
  senderAvatar: string;
  /** 展示用时间文案 */
  createTimeLabel: string;
  /** 正文（纯文本或多段中的主文） */
  content: string;
  /** 1、2：图片 URL 列表（已可直链或可经 baseURL 拼接） */
  images?: string[];
  /** 2、3：外链 */
  linkUrl?: string;
  linkTitle?: string;
}
