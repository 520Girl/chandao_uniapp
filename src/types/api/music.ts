/**
 * GET `/app/music/page` 等音乐模块接口契约（需登录）。
 */

/** 分页查询 Query：`page` 默认 1，`size` 默认 20 */
export interface MusicPageQuery {
  page?: number;
  size?: number;
}

/** 列表单项 */
export interface MusicListItemDTO {
  id: number;
  title: string;
  /** 音频地址，多为 `/upload/...`，前端需拼 `baseURL` */
  audioUrl: string;
  coverUrl?: string | null;
  /** 时长（秒） */
  durationSeconds: number;
}

/** 分页元信息 */
export interface MusicPaginationDTO {
  page: number;
  size: number;
  total: number;
}

/** `GET /app/music/page` 的 data */
export interface MusicPageData {
  list: MusicListItemDTO[];
  pagination: MusicPaginationDTO;
}
