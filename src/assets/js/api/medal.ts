// 勋章：用户勋章与模板
import { get } from '../request';
import type { MedalTemplate, UserMedal } from '@/types/api/medal';

const USER_MEDALS_PATH = '/app/medal/medal/user-medals';
const TEMPLATES_PATH = '/app/medal/medal/templates';

/**
 * 获取当前用户已获得的勋章列表（需登录）。
 * @returns 业务包 `data` 为 `UserMedal[]`；具体以 `request` 拦截器解包后结构为准
 */
export const fetchUserMedals = () => {
  return get(USER_MEDALS_PATH);
};

/**
 * 获取所有启用中的勋章模板（需登录）。
 * @returns 业务包 `data` 为 `MedalTemplate[]`
 */
export const fetchMedalTemplates = () => {
  return get(TEMPLATES_PATH);
};
