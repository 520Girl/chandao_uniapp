/**
 * 活动「从模板创建」表单：与后台 info.vue 对齐的日期规范化、sessionConfig 解析、提交用时间字符串。
 */

export function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/** `YYYY-MM-DD HH:mm:ss`（本地），用于表单展示与原生日期控件 */
export function toBackendDateTimeString(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${mo}-${day} ${h}:${mi}:${s}`;
}

/** ISO 8601（UTC），供 `POST /app/activity/createFromTemplate` 的 `startDate`/`endDate` 与 `sessionConfig.scheduled*` */
export function toIsoDateTimeString(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

/** 详情回显：去空格、`T`→空格、截断到 19 位 */
export function normalizeDateTimeValue(raw: string | null | undefined): string {
  let v = String(raw ?? "").trim().replace("T", " ");
  if (v.length > 19) v = v.slice(0, 19);
  return v;
}

export type GroupSessionDefaults = {
  roomNo: string;
  maxParticipants: number;
  rankGraceSeconds: number;
};

/** 从模板 `sessionConfigDefault`（JSON 或对象）解析共修默认 */
export function parseSessionConfigDefault(raw: unknown): GroupSessionDefaults {
  let obj: Record<string, unknown> = {};
  if (raw == null) {
    return { roomNo: "", maxParticipants: 20, rankGraceSeconds: 30 };
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return { roomNo: "", maxParticipants: 20, rankGraceSeconds: 30 };
    try {
      obj = JSON.parse(t) as Record<string, unknown>;
    } catch {
      return { roomNo: "", maxParticipants: 20, rankGraceSeconds: 30 };
    }
  } else if (typeof raw === "object" && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>;
  } else {
    return { roomNo: "", maxParticipants: 20, rankGraceSeconds: 30 };
  }
  const roomNo = String(obj.roomNo ?? obj.room_no ?? "").trim();
  const maxRaw = Number(obj.maxParticipants ?? obj.max_participants ?? 20);
  const rankRaw = Number(obj.rankGraceSeconds ?? obj.rank_grace_seconds ?? 30);
  return {
    roomNo,
    maxParticipants: clampInt(Number.isFinite(maxRaw) ? maxRaw : 20, 0, 20),
    rankGraceSeconds: clampInt(Number.isFinite(rankRaw) ? rankRaw : 30, 0, 300),
  };
}
