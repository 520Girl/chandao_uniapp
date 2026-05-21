/**
 * 冥想报告详情与统计：详情 `data`、统计 `data` 的解析与字段兼容（含 snake_case）。
 */
import { fetchMeditationReportDetail } from "@/assets/js/api/meditation";
import { unwrapApiData } from "@/utils/apiResponse";
import type {
  MeditationChartSeriesItem,
  MeditationReport,
  MeditationReportShareData,
  MeditationReportSharer,
  MeditationReportHistoryListItem,
  MeditationReportHistoryResult,
  MeditationReportSection,
  MeditationStatisticsCompareChartData,
  MeditationStatisticsCompareMetricBlock,
  MeditationReportStatisticsData,
  MeditationStatisticsChartBlock,
  MeditationStatisticsLast7SessionItem,
  MeditationStatisticsPeriodSummary,
  MeditationStatisticsRange,
  MeditationStatisticsTrendPoint,
} from "@/types/api/meditation";

/** 统计接口固定 7 等分桶 */
const STATISTICS_BUCKET = 7;

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
  if (!Number.isFinite(sessionId) || sessionId <= 0) {
    return null;
  }
  const idRaw = Number(o.id ?? o.reportId ?? o.report_id);
  const id = Number.isFinite(idRaw) && idRaw > 0 ? idRaw : sessionId;

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

const REPORT_DETAIL_RETRY_DEFAULTS = { maxAttempts: 6, intervalMs: 500 };

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 结束禅修后拉报告详情：后端生成报告可能有延迟，短间隔重试避免空报告页。
 *
 * @param sessionId 会话 ID
 * @param options `maxAttempts` 默认 6；`intervalMs` 默认 500
 */
export async function loadMeditationReportDetailWithRetry(
  sessionId: number,
  options?: { maxAttempts?: number; intervalMs?: number },
): Promise<MeditationReport | null> {
  const sid = Math.floor(Number(sessionId));
  if (!Number.isFinite(sid) || sid <= 0) return null;

  const maxAttempts = Math.max(1, options?.maxAttempts ?? REPORT_DETAIL_RETRY_DEFAULTS.maxAttempts);
  const intervalMs = Math.max(200, options?.intervalMs ?? REPORT_DETAIL_RETRY_DEFAULTS.intervalMs);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const res = await fetchMeditationReportDetail({ sessionId: sid });
      const raw = unwrapApiData<unknown>(res);
      const parsed = parseMeditationReportDetailPayload(raw);
      if (parsed) return parsed;
    } catch (e) {
      console.error("loadMeditationReportDetailWithRetry", e);
    }
    if (attempt < maxAttempts - 1) {
      await sleepMs(intervalMs);
    }
  }
  return null;
}

function parseSharer(raw: unknown): MeditationReportSharer | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const nickName = String(o.nickName ?? o.nick_name ?? "").trim();
  const avatarUrl = String(o.avatarUrl ?? o.avatar_url ?? "").trim();
  if (!nickName && !avatarUrl) return undefined;
  return {
    ...(nickName ? { nickName } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
  };
}

/**
 * 解析 `GET /app/meditation/report/share` 的 `data`（免登录分享页）。
 *
 * @param raw 接口 `data` 或 `unwrapApiData` 后的对象
 * @returns 报告 + 分享者；无效时 `null`
 */
export function parseMeditationReportSharePayload(raw: unknown): MeditationReportShareData | null {
  if (raw == null || typeof raw !== "object") return null;
  const report = parseMeditationReportDetailPayload(raw);
  if (!report) return null;
  const o = raw as Record<string, unknown>;
  const sharer = parseSharer(o.sharer);
  return sharer ? { ...report, sharer } : report;
}

function isFiniteNumberArray(a: unknown): a is number[] {
  return Array.isArray(a) && a.every((x) => typeof x === "number" && Number.isFinite(x));
}

function parseStatisticsSeriesItem(raw: unknown): MeditationChartSeriesItem | null {
  if (raw == null || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const name = String(s.name ?? "").trim() || "系列";
  const data = s.data;
  if (!isFiniteNumberArray(data) || data.length === 0) return null;
  return { name, data };
}

function parseStatisticsChartBlock(raw: unknown): MeditationStatisticsChartBlock | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const catsRaw = o.categories ?? o.Categories;
  if (!Array.isArray(catsRaw) || catsRaw.length === 0) return null;
  const categories = catsRaw.map((c) => String(c ?? ""));
  const seriesRaw = o.series ?? o.Series;
  if (!Array.isArray(seriesRaw) || seriesRaw.length === 0) return null;
  const series: MeditationChartSeriesItem[] = [];
  for (const item of seriesRaw) {
    const one = parseStatisticsSeriesItem(item);
    if (!one) return null;
    series.push(one);
  }
  const n = categories.length;
  for (const ser of series) {
    if (ser.data.length !== n) return null;
  }
  return { categories, series };
}

function isSevenBucketChart(block: MeditationStatisticsChartBlock): boolean {
  if (block.categories.length !== STATISTICS_BUCKET) return false;
  return block.series.every((se) => se.data.length === STATISTICS_BUCKET);
}

function parseCompareMetricBlock(
  raw: unknown,
  categoriesLength: number,
): MeditationStatisticsCompareMetricBlock | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const seriesRaw = o.series ?? o.Series;
  if (!Array.isArray(seriesRaw) || seriesRaw.length !== 2) return null;
  const series: MeditationChartSeriesItem[] = [];
  for (const item of seriesRaw) {
    const one = parseStatisticsSeriesItem(item);
    if (!one || one.data.length !== categoriesLength) return null;
    series.push(one);
  }
  return { series };
}

function parseCompareChartData(raw: unknown): MeditationStatisticsCompareChartData | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const catsRaw = o.categories ?? o.Categories;
  if (!Array.isArray(catsRaw) || catsRaw.length !== STATISTICS_BUCKET) return null;
  const categories = catsRaw.map((c) => String(c ?? ""));

  const heartRate = parseCompareMetricBlock(o.heartRate ?? o.heart_rate, categories.length);
  const breathRate = parseCompareMetricBlock(o.breathRate ?? o.breath_rate, categories.length);
  const movement = parseCompareMetricBlock(o.movement, categories.length);
  const duration = parseCompareMetricBlock(o.duration, categories.length);
  if (!heartRate || !breathRate || !movement || !duration) return null;

  return {
    categories,
    heartRate,
    breathRate,
    movement,
    duration,
  };
}

function parseStatisticsRangeField(v: unknown): MeditationStatisticsRange {
  const r = String(v ?? "week").toLowerCase();
  if (r === "day" || r === "week" || r === "month") return r;
  return "week";
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    const x = obj[k];
    if (x == null || x === "") continue;
    const n = Number(x);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function pickNonNegInt(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    const x = obj[k];
    if (x == null || x === "") continue;
    const n = Math.floor(Number(x));
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
}

/** 非负浮点数（不做 floor），用于「分钟」等可能为小数的字段，如 `latestSessionMinutes` */
function pickNonNegativeNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    const x = obj[k];
    if (x == null || x === "") continue;
    const n = Number(x);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
}

function parseLast7SessionItem(raw: unknown): MeditationStatisticsLast7SessionItem | null {
  if (raw == null || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const sessionId = Number(s.sessionId ?? s.session_id);
  const durationMinutes = pickNonNegInt(s, ["durationMinutes", "duration_minutes"]);
  const startDate = String(s.startDate ?? s.start_date ?? "");
  if (!Number.isFinite(sessionId) || sessionId <= 0) return null;
  return { sessionId, durationMinutes, startDate };
}

function parsePeriodSummary(raw: unknown): MeditationStatisticsPeriodSummary | null {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const s = raw as Record<string, unknown>;
  const rangeStart = String(s.rangeStart ?? s.range_start ?? "");
  const rangeEnd = String(s.rangeEnd ?? s.range_end ?? "");
  if (!rangeStart.trim() || !rangeEnd.trim()) return null;
  return {
    rangeStart,
    rangeEnd,
    sessionCount: pickNonNegInt(s, ["sessionCount", "session_count"]),
    totalDurationMinutes: pickNonNegInt(s, ["totalDurationMinutes", "total_duration_minutes"]),
    avgHeartRate: pickNumber(s, ["avgHeartRate", "avg_heart_rate"]),
    avgBreathRate: pickNumber(s, ["avgBreathRate", "avg_breath_rate"]),
    movementCount: pickNonNegInt(s, ["movementCount", "movement_count"]),
    avgMovementPerMinute: pickNumber(s, ["avgMovementPerMinute", "avg_movement_per_minute"]),
    latestSessionId: pickNonNegInt(s, ["latestSessionId", "latest_session_id"]),
    latestSessionMinutes: pickNonNegativeNumber(s, ["latestSessionMinutes", "latest_session_minutes"]),
  };
}

function parseTrendPoint(raw: unknown): MeditationStatisticsTrendPoint | null {
  if (raw == null || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const index = Math.floor(Number(s.index ?? s.Index));
  if (!Number.isFinite(index) || index < 0 || index > STATISTICS_BUCKET - 1) return null;
  const label = String(s.label ?? "").trim();
  if (!label) return null;
  const rangeStart = String(s.rangeStart ?? s.range_start ?? "").trim();
  const rangeEnd = String(s.rangeEnd ?? s.range_end ?? "").trim();
  if (!rangeStart || !rangeEnd) return null;
  return {
    index,
    label,
    rangeStart,
    rangeEnd,
    totalDurationMinutes: pickNonNegInt(s, ["totalDurationMinutes", "total_duration_minutes"]),
    sessionCount: pickNonNegInt(s, ["sessionCount", "session_count"]),
    avgHeartRate: pickNumber(s, ["avgHeartRate", "avg_heart_rate"]),
    avgBreathRate: pickNumber(s, ["avgBreathRate", "avg_breath_rate"]),
    movementCount: pickNonNegInt(s, ["movementCount", "movement_count"]),
  };
}

function parseLast7SessionsFromField(raw: unknown): MeditationStatisticsLast7SessionItem[] {
  if (!Array.isArray(raw)) return [];
  const out: MeditationStatisticsLast7SessionItem[] = [];
  for (const item of raw) {
    const one = parseLast7SessionItem(item);
    if (one) out.push(one);
  }
  return out;
}

function parseTrendArrayStrict(raw: unknown): MeditationStatisticsTrendPoint[] | null {
  if (!Array.isArray(raw) || raw.length !== STATISTICS_BUCKET) return null;
  const out: MeditationStatisticsTrendPoint[] = [];
  for (const item of raw) {
    const one = parseTrendPoint(item);
    if (!one) return null;
    out.push(one);
  }
  out.sort((a, b) => a.index - b.index);
  return out;
}

/**
 * 解析 `GET /app/meditation/report/statistics` 的 `data`（5.4.2，兼容 snake_case）。
 * 要求双图与 `trend` 均为 7 桶；`currentPeriod` / `previousPeriod` 须含合法时间范围。
 * @param raw 接口 `data`
 * @returns 合法结构；校验失败返回 `null`
 */
export function parseMeditationReportStatisticsPayload(raw: unknown): MeditationReportStatisticsData | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const durationChartData = parseStatisticsChartBlock(
    o.durationChartData ?? o.duration_chart_data,
  );
  const compareChartData = parseCompareChartData(o.compareChartData ?? o.compare_chart_data);
  if (!durationChartData || !compareChartData || !isSevenBucketChart(durationChartData)) {
    return null;
  }

  const currentPeriod = parsePeriodSummary(o.currentPeriod ?? o.current_period);
  const previousPeriod = parsePeriodSummary(o.previousPeriod ?? o.previous_period);
  if (!currentPeriod || !previousPeriod) return null;

  const trend = parseTrendArrayStrict(o.trend);
  if (!trend) return null;

  const bc = pickNonNegInt(o, ["bucketCount", "bucket_count"]);
  const bucketCount = bc === STATISTICS_BUCKET ? bc : STATISTICS_BUCKET;

  const range = parseStatisticsRangeField(o.range);
  const latestSessionMinutes = pickNonNegativeNumber(o, ["latestSessionMinutes", "latest_session_minutes"]);
  const last7SessionsTotalMinutes = pickNonNegInt(o, [
    "last7SessionsTotalMinutes",
    "last7_sessions_total_minutes",
  ]);
  const last7Sessions = parseLast7SessionsFromField(o.last7Sessions ?? o.last7_sessions);
  const latestSessionId = pickNonNegInt(o, ["latestSessionId", "latest_session_id"]);
  

  return {
    range,
    bucketCount,
    currentPeriod,
    previousPeriod,
    latestSessionMinutes,
    last7SessionsTotalMinutes,
    last7Sessions,
    trend,
    durationChartData,
    compareChartData,
    latestSessionId,
  };
}

function parseHistoryListItem(raw: unknown): MeditationReportHistoryListItem | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const sessionId = Number(o.sessionId ?? o.session_id);
  if (!Number.isFinite(sessionId) || sessionId <= 0) return null;
  const id = Number(o.id);
  return {
    sessionId,
    id: Number.isFinite(id) && id > 0 ? id : undefined,
    totalDuration: pickNum(o, ["totalDuration", "total_duration"]),
    createTime: String(o.createTime ?? o.create_time ?? "").trim() || undefined,
    summaryText: String(o.summaryText ?? o.summary_text ?? "").trim() || undefined,
  };
}

/**
 * 解析 `GET /app/meditation/report/history` 的 `data`（或已 unwrap 的对象）。
 * 兼容 `list` / `records` / `rows`、或直接数组；`total` / `count` / `totalCount`。
 */
export function parseMeditationReportHistoryPayload(raw: unknown): MeditationReportHistoryResult {
  const empty: MeditationReportHistoryResult = { list: [], total: 0 };
  if (raw == null) return empty;
  if (Array.isArray(raw)) {
    const list = raw
      .map((row) => parseHistoryListItem(row))
      .filter((x): x is MeditationReportHistoryListItem => x != null);
    return { list, total: list.length };
  }
  if (typeof raw !== "object") return empty;
  const root = raw as Record<string, unknown>;
  const arrRaw = root.list ?? root.records ?? root.rows ?? root.items;
  const nested = root.data;
  const arr = Array.isArray(arrRaw)
    ? arrRaw
    : Array.isArray(nested)
      ? (nested as unknown[])
      : null;
  if (!arr) return empty;
  const list = arr
    .map((row) => parseHistoryListItem(row))
    .filter((x): x is MeditationReportHistoryListItem => x != null);
  const totalRaw = root.total ?? root.Total ?? root.count ?? root.totalCount ?? root.total_count;
  const total = Number(totalRaw);
  return {
    list,
    total: Number.isFinite(total) && total >= 0 ? total : undefined,
  };
}
