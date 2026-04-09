/**
 * 团队相关接口契约（`/app/team/*`）。
 */

/** GET `/app/team/member/page` Query */
export interface TeamMemberPageQuery {
  /** 不传默认取用户 firstTeamId */
  teamId?: number | null;
  /** 0 全部 1 仅负责人 2 仅成员；默认 0 */
  role?: number;
  page?: number;
  /** 默认 20，最大 100 */
  size?: number;
}

/** 团队成员行 */
export interface TeamMemberRow {
  userId: number;
  nickName?: string | null;
  avatarUrl?: string | null;
  joinedAt?: string | null;
  /** 1 负责人 0 成员 */
  isOwner: number;
  postCount: number;
}

/** GET `/app/team/member/page` 的 data */
export interface TeamMemberPageData {
  teamId: number;
  list: TeamMemberRow[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

/** POST `/app/team/member/remove` Body；成功后 `data` 为 `null`；仅负责人可操作，不可移除负责人 */
export interface TeamMemberRemoveDTO {
  teamId: number;
  userId: number;
}
