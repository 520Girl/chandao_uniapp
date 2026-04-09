/**
 * 团队 HTTP（`/app/team/*`）。
 */
import { get, post } from "../request";
import type { TeamMemberPageQuery, TeamMemberRemoveDTO } from "@/types/api/team";

const TEAM_MEMBER_PAGE_PATH = "/app/team/member/page";
const TEAM_MEMBER_REMOVE_PATH = "/app/team/member/remove";

/**
 * 团队成员分页（我所在团队）；需登录。
 *
 * @param query `teamId` 可选默认 firstTeamId；`role` 0/1/2；分页
 */
export const fetchTeamMemberPage = (query?: TeamMemberPageQuery) => {
  return get(TEAM_MEMBER_PAGE_PATH, query ?? {});
};

/**
 * 将成员移出团队；成功后业务 `data` 为 `null`；需登录，仅团队负责人可操作，不可移除负责人。
 *
 * @param body `teamId`、`userId` 必填
 */
export const postTeamMemberRemove = (body: TeamMemberRemoveDTO) => {
  return post(TEAM_MEMBER_REMOVE_PATH, body);
};
