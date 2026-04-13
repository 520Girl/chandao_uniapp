/**
 * 冥想报告详情：将接口 `data` 转为前端可用的 `MeditationReport` 形状，
 * 兼容 `data.report` 嵌套、`sections` 为 JSON 字符串、分段字段 snake_case。
 */
import type { MeditationReport, MeditationReportSection } from "@/types/api/meditation";

function pickNum(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (v == null || v === "") continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

/**
 * 解析 `GET /app/meditation/report/detail` 等业务返回的 `data`（或已 `unwrap` 的对象）。
 * @param raw 接口 `data` 或整包经 `unwrapApiData` 后的对象
 * @returns 合并 `sections` 后的报告；`raw` 无效时返回 `null`
 */
export function parseMeditationReportDetailPayload(raw: unknown): MeditationReport | null {
  if (raw == null || typeof raw !== "object") return null;
  let o = raw as Record<string, unknown>;

  const nested = o.report;
  if (nested && typeof nested === "object") {
    o = { ...(nested as Record<string, unknown>) };
  }

  const sessionId = Number(o.sessionId ?? o.session_id);
  const id = Number(o.id);
  if (!Number.isFinite(sessionId) || sessionId <= 0 || !Number.isFinite(id)) {
    return null;
  }

  let sectionsUnknown: unknown = o.sections;
  if (typeof sectionsUnknown === "string") {
    try {
      sectionsUnknown = JSON.parse(sectionsUnknown) as unknown;
    } catch {
      sectionsUnknown = null;
    }
  }

  if (!Array.isArray(sectionsUnknown) || sectionsUnknown.length === 0) {
    return { ...o, sessionId, id } as unknown as MeditationReport;
  }

  const sections: MeditationReportSection[] = [];
  for (let i = 0; i < sectionsUnknown.length; i++) {
    const item = sectionsUnknown[i];
    if (item == null || typeof item !== "object") continue;
    const s = item as Record<string, unknown>;
    const idxRaw = s.index ?? s.Index ?? i + 1;
    const idx = Number(idxRaw);
    sections.push({
      index: Number.isFinite(idx) ? idx : i + 1,
      avgHeartRate: pickNum(s, ["avgHeartRate", "avg_heart_rate"]),
      avgBreathRate: pickNum(s, ["avgBreathRate", "avg_breath_rate"]),
      movementCount: pickNum(s, [
        "movementCount",
        "movement_count",
        "moveCount",
        "move_count",
        "bodyMovementCount",
        "body_movement_count",
      ]),
    });
  }

  return { ...o, sessionId, id, sections } as unknown as MeditationReport;
}
