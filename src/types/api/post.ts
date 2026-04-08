/**
 * 动态 / 活动 / 融合流 接口契约（`/app/post/*`）。
 */

/** 通用分页（与融合流一致） */
export interface PostFeedPagination {
  page?: number;
  size?: number;
  total?: number;
}

/**
 * 动态实体 `PostInfo`（分享/手动发布等接口返回的 data）。
 * `type`：业务类型，取值以后端为准。
 */
export interface PostInfo {
  id: number;
  type: number;
  userId: number;
  teamId?: number | null;
  content?: string | null;
  images?: string[] | null;
  /** 1漂浮 2宁静 3消散 4觉察 */
  userState: number;
  status: number;
  createTime: string;
  updateTime: string;
}

/** POST `/app/post/share` Body */
export interface PostShareDTO {
  /** 冥想报告 ID */
  reportId: number;
  /** 自定义文案；空则后端生成默认文案 */
  content?: string;
  /** 指定发布团队；传入时须为团队成员 */
  targetTeamId?: number | null;
  /** 用户状态，默认 1 */
  userState?: number;
}

/** POST `/app/post/manual` Body */
export interface PostManualDTO {
  content: string;
  images?: string[];
  teamId?: number | null;
  /** 用户状态，默认 1 */
  userState?: number;
}

/** PUT `/app/post/update` Body */
export interface PostUpdateDTO {
  id: number;
  content: string;
  images?: string[];
}

/** GET `/app/post/feed`、`/feed/teams`、`/feed/mixed` 共用 Query */
export interface PostFeedQuery {
  /** 页码，默认 1 */
  page?: number;
  /** 每页条数，默认 20 */
  size?: number;
}

/** GET `/app/post/feed` 的 data */
export interface PostFeedPage {
  list: PostInfo[];
  pagination: PostFeedPagination;
}

/**
 * 团队动态流列表项：在 `PostInfo` 上拼接展示字段。
 */
export interface PostFeedTeamsItem extends PostInfo {
  nickName?: string | null;
  avatarUrl?: string | null;
}

/** GET `/app/post/feed/teams` 的 data */
export interface PostFeedTeamsPage {
  list: PostFeedTeamsItem[];
  pagination: PostFeedPagination;
}

/** GET `/app/post/feed/mixed` Query */
export type MixedFeedQuery = PostFeedQuery;

/** 融合流列表项：`itemType` 区分动态与活动 */
export interface MixedFeedItem {
  itemType: "post" | "activity";
  /** post_info.id 或 activity_info.id */
  id: number;
  /** 排序时间：动态取 updateTime；活动优先 startDate，无则 createTime */
  sortTime: string;
  /** 置顶：活动取 isTop，动态恒为 0 */
  isTop: number;
  teamId?: number | null;
  userId?: number | null;
  /** 仅动态 */
  nickName?: string | null;
  /** 仅动态 */
  avatarUrl?: string | null;
  /** 仅动态：1 分享报告 / 2 手动发布 */
  postType?: number | null;
  /** 仅动态：1漂浮 2宁静 3消散 4觉察 */
  userState?: number | null;
  /** 仅活动 */
  isLiked?: boolean | null;
  /** 动态正文 / 活动摘要 */
  content?: string | null;
  /** 仅动态 */
  images?: string[] | null;
  /** 仅动态 */
  likeCount?: number | null;
  /** 仅活动 */
  activityTitle?: string | null;
  activityStartDate?: string | null;
  activityEndDate?: string | null;
  activityTemplateName?: string | null;
  activityTemplateIcon?: string | null;
  /** 扩展字段（后端可能返回，用于前端展示） */
  participantCount?: number | null;
  participantUsers?: string[] | null;
  isJoined?: boolean | null;
}

/** GET `/app/post/feed/mixed` 的 data */
export interface MixedFeedPage {
  list: MixedFeedItem[];
  pagination?: PostFeedPagination;
}

/** POST `/app/post/like` Body */
export interface PostLikeDTO {
  /** 动态 id（post_info.id） */
  id: number;
}

/** GET `/app/post/info` Query */
export interface PostInfoQuery {
  /** post_info.id */
  id: number;
}

/**
 * GET `/app/post/info` 的 data：动态详情。
 * 在 `PostInfo` 基础上带列表同源展示字段；若后端仅返回基础实体，扩展字段可能为空。
 */
export interface PostDetailInfo extends PostInfo {
  nickName?: string | null;
  avatarUrl?: string | null;
  likeCount?: number | null;
  isLiked?: boolean | null;
  /** 评论条数；无此字段时前端可置 0 */
  commentCount?: number | null;
  /** 与融合流一致时可能单独返回：1 分享报告 / 2 手动发布 */
  postType?: number | null;
}
