// 消息中心接口封装
import { get, post } from '../request';
import type {
  MessageActionDTO,
  MessageActionResult,
  MessageDeleteDTO,
  MessagePageDTO,
  MessageReadDTO,
} from '@/types/api/message';

const PAGE_PATH = '/app/message/page';
const INFO_PATH = '/app/message/info';
const UNREAD_COUNT_PATH = '/app/message/unread-count';
const READ_PATH = '/app/message/read';
const DELETE_PATH = '/app/message/delete';
const ACTION_PATH = '/app/message/action';

/**
 * 消息分页列表（需登录）。
 */
export const fetchMessagePage = (body?: MessagePageDTO) => {
  return post(PAGE_PATH, body ?? {});
};

/**
 * 消息详情（需登录）。
 * @param params.messageId 消息主键 ID
 * @returns 业务包；`data` 为 `MessageInfo | null`
 */
export const fetchMessageInfo = (params: { messageId: number }) => {
  return get(INFO_PATH, params);
};

/**
 * 未读消息数量。
 */
export const fetchMessageUnreadCount = () => {
  return get(UNREAD_COUNT_PATH);
};

/**
 * 标记单条消息为已读。
 */
export const markMessageRead = (body: MessageReadDTO) => {
  return post(READ_PATH, body);
};

/**
 * 删除消息（单条或批量）。
 */
export const deleteMessage = (body: MessageDeleteDTO) => {
  return post(DELETE_PATH, body);
};

/**
 * 消息动作（如活动参与）。
 */
export const postMessageAction = (body: MessageActionDTO) => {
  return post(ACTION_PATH, body) as Promise<MessageActionResult>;
};