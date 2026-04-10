/**
 * 音乐分页接口数据与疗愈列表 UI 行之间的映射（无 HTTP）。
 */
import { config } from "@/assets/js/config";
import type { MusicListItemDTO } from "@/types/api/music";

/**
 * 将接口返回的音频/封面相对路径转为可播放 URL（补全 `baseURL`）。
 */
export function resolveMusicAssetUrl(raw: string | undefined | null): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

/**
 * 将时长（秒）格式化为 `m:ss`，用于列表副标题。
 */
export function formatMusicDurationLabel(sec: unknown): string {
  const n = Number(sec);
  const s = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

/** 与首页 `AudioTrack` 一致的可播放行 */
export type MusicTrackRow = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  coverClass: string;
  coverUrl: string;
};

/**
 * @param item 接口列表项
 * @param visualIndex 用于封面色轮换的下标
 * @param coverClassCycle Tailwind 类名循环
 */
export function mapMusicListItemToRow(
  item: MusicListItemDTO,
  visualIndex: number,
  coverClassCycle: readonly string[],
): MusicTrackRow {
  const n = coverClassCycle.length || 1;
  return {
    id: String(item.id),
    title: String(item.title ?? "").trim() || "未命名",
    subtitle: formatMusicDurationLabel(item.durationSeconds),
    url: resolveMusicAssetUrl(item.audioUrl),
    coverClass: coverClassCycle[((visualIndex % n) + n) % n],
    coverUrl: resolveMusicAssetUrl(item.coverUrl),
  };
}
