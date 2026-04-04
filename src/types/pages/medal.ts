/**
 * 勋章墙列表项：由模板与用户记录组合，供 `medal` 页面展示。
 */
export interface MedalGridItem {
  /** 模板 id，与 `MedalTemplate.id`、`UserMedal.medalId` 对应 */
  templateId: number;
  name: string;
  description: string;
  /** 展示用图标地址或空（无则走默认图标） */
  icon: string;
  type: string;
  /** 模板侧等级 */
  templateLevel: number;
  /** 是否已获得 */
  unlocked: boolean;
  /** 用户记录上的等级（仅已获得时有值） */
  userLevel?: number;
  /** 获得时间（仅已获得时有值） */
  obtainedAt?: string;
}
