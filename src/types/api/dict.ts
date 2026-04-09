export interface reqStatus {
    types: string[] | null;
}


export interface resItem {
  id: number;
  typid: number;
  name: string;
  value: number;
  orderNum: number;
  parentId: number | null;
  type: number | null;
}

/**
 * `post_user_state` 字典项（前端列表/选择器用，由接口 `resItem` 映射）。
 */
export interface PostUserStateDictItem {
  /** 提交动态时的 userState */
  value: number;
  /** 展示名 */
  name: string;
  /** 排序权重（来自字典 orderNum） */
  orderNum: number;
}