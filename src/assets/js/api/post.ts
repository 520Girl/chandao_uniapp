/**
 * 动态 / 社群 Post 模块 HTTP（发布、编辑、流、点赞、融合流等）。
 */
import { get, post, put } from "../request";
import type {
  MixedFeedQuery,
  PostFeedQuery,
  PostInfoQuery,
  PostLikeDTO,
  PostManualDTO,
  PostShareDTO,
  PostUpdateDTO,
} from "@/types/api/post";

const POST_SHARE_PATH = "/app/post/share";
const POST_MANUAL_PATH = "/app/post/manual";
const POST_UPDATE_PATH = "/app/post/update";
const POST_FEED_PATH = "/app/post/feed";
const POST_FEED_TEAMS_PATH = "/app/post/feed/teams";
const MIXED_FEED_PATH = "/app/post/feed/mixed";
const POST_LIKE_PATH = "/app/post/like";
const POST_INFO_PATH = "/app/post/info";

/**
 * 分享冥想报告生成动态；成功后 `data` 为 `PostInfo`；需登录。
 *
 * @param body `reportId` 必填；`content` / `targetTeamId` / `userState` 可选
 */
export const postPostShare = (body: PostShareDTO) => {
  return post(POST_SHARE_PATH, body);
};

/**
 * 手动发布动态；成功后 `data` 为 `PostInfo`；需登录。
 *
 * @param body `content` 必填；`images` / `teamId` / `userState` 可选
 */
export const postPostManual = (body: PostManualDTO) => {
  return post(POST_MANUAL_PATH, body);
};

/**
 * 编辑手动动态；成功后业务 `data` 为 `null`；需登录。
 *
 * @param body `id`、`content` 必填；`images` 可选
 */
export const putPostUpdate = (body: PostUpdateDTO) => {
  return put(POST_UPDATE_PATH, body);
};

/**
 * 动态流（我的动态）；需登录。
 *
 * @param query `page` / `size`
 */
export const fetchPostFeed = (query?: PostFeedQuery) => {
  return get(POST_FEED_PATH, query ?? {});
};

/**
 * 动态流（团队动态）；列表项含 `nickName` / `avatarUrl`；需登录。
 *
 * @param query `page` / `size`
 */
export const fetchPostFeedTeams = (query?: PostFeedQuery) => {
  return get(POST_FEED_TEAMS_PATH, query ?? {});
};

/**
 * 融合动态流（动态 + 活动），分页；需登录。
 *
 * @param query `page` / `size`
 */
export const fetchMixedFeed = (query?: MixedFeedQuery) => {
  return get(MIXED_FEED_PATH, query ?? {});
};

/**
 * 动态详情；需登录。
 *
 * @param query `id` 为 post_info.id
 */
export const fetchPostDetail = (query: PostInfoQuery) => {
  return get(POST_INFO_PATH, query);
};

/**
 * 点赞动态；成功后业务 `data` 为 `null`；需登录。
 *
 * @param body `id` 为 post_info.id
 */
export const postPostLike = (body: PostLikeDTO) => {
  return post(POST_LIKE_PATH, body);
};
