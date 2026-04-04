/**
 * 勋章域接口契约：用户已获得记录与勋章模板。
 * 时间字段一般为 ISO 8601 字符串，以后端为准。
 */

/** 后端返回的解锁条件 JSON，结构随业务扩展 */
export type MedalCondition = Record<string, unknown>;

/** 用户已获得勋章记录 */
export interface UserMedal {
  /** 记录主键 */
  id: number;
  userId: number;
  /** 对应勋章模板 id */
  medalId: number;
  /** 获得时间 */
  obtainedAt: string;
  /** 获得时的等级 */
  level: number;
  createTime: string;
  updateTime: string;
}

/** 勋章模板（启用态由接口筛选；`isActive` 与后端约定，常见 1 启用 0 停用） */
export interface MedalTemplate {
  id: number;
  name: string;
  /** 图标 URL 或资源标识，可能为空 */
  icon?: string;
  type: string;
  description?: string;
  condition: MedalCondition;
  level: number;
  isActive: number;
  createTime: string;
  updateTime: string;
}
