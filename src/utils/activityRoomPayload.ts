/**
 * 多人共修 `roomState` / `roomResult` 响应解析：兼容多层 `data` 包裹与常见 snake_case 字段。
 */
import type {
  ActivityRoomParticipant,
  ActivityRoomRankingEntry,
  ActivityRoomResultData,
  ActivityRoomStateData,
  SceneType,
} from "@/types/api/activity";
import { unwrapApiDataDeep } from "@/utils/apiResponse";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function str(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

function bool(v: unknown): boolean {
  return v === true || v === 1 || v === "1" || v === "true";
}

function intArray(v: unknown): number[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => num(x)).filter((n): n is number => n != null);
}

function normalizeParticipant(raw: unknown): ActivityRoomParticipant {
  if (!isRecord(raw)) {
    return { userId: 0, readyStatus: 0, roomRole: 1, nickName: null, avatarUrl: null };
  }
  const o = raw;
  return {
    userId: num(o.userId ?? o.user_id) ?? 0,
    readyStatus: num(o.readyStatus ?? o.ready_status) ?? 0,
    roomRole: num(o.roomRole ?? o.room_role) ?? 1,
    nickName: str(o.nickName ?? o.nick_name) ?? null,
    avatarUrl: str(o.avatarUrl ?? o.avatar_url) ?? null,
  };
}

function normalizeRankingEntry(raw: unknown): ActivityRoomRankingEntry | null {
  if (!isRecord(raw)) return null;
  const o = raw;
  const userId = num(o.userId ?? o.user_id);
  const rank = num(o.rank);
  if (userId == null || rank == null) return null;
  const focusScoreWeighted = num(o.focusScoreWeighted ?? o.focus_score_weighted);
  const sitCount = num(o.sitCount ?? o.sit_count);
  const stabilityScore = num(o.stabilityScore ?? o.stability_score);
  const compositeScore = num(o.compositeScore ?? o.composite_score);
  return {
    rank,
    userId,
    nickName: str(o.nickName ?? o.nick_name) ?? "-",
    avatarUrl: str(o.avatarUrl ?? o.avatar_url) ?? null,
    durationSeconds: num(o.durationSeconds ?? o.duration_seconds) ?? 0,
    avgHeartRateWeighted: num(o.avgHeartRateWeighted ?? o.avg_heart_rate_weighted) ?? 0,
    avgBreathRateWeighted: num(o.avgBreathRateWeighted ?? o.avg_breath_rate_weighted) ?? 0,
    movementCount: num(o.movementCount ?? o.movement_count) ?? 0,
    lastSessionEnd: str(o.lastSessionEnd ?? o.last_session_end) ?? null,
    ...(focusScoreWeighted != null ? { focusScoreWeighted } : {}),
    ...(sitCount != null ? { sitCount } : {}),
    ...(stabilityScore != null ? { stabilityScore } : {}),
    ...(compositeScore != null ? { compositeScore } : {}),
  };
}

function mapRankingList(v: unknown): ActivityRoomRankingEntry[] {
  if (!Array.isArray(v)) return [];
  return v.map(normalizeRankingEntry).filter((x): x is ActivityRoomRankingEntry => x != null);
}

/** 从 `fetchActivityRoomState` 的 resolve 值解析为强类型房间态 */
export function parseRoomStateFromResponse(res: unknown): ActivityRoomStateData | null {
  const raw = unwrapApiDataDeep<unknown>(res);
  if (!isRecord(raw)) return null;
  const o = raw;
  const activityId = num(o.activityId ?? o.activity_id);
  const phase = num(o.phase);
  if (activityId == null || phase == null) return null;

  const participantsRaw = Array.isArray(o.participants) ? o.participants : [];
  const participants = participantsRaw.map(normalizeParticipant);

  return {
    activityId,
    title: str(o.title) ?? "",
    teamId: num(o.teamId ?? o.team_id) ?? null,
    phase,
    startAt: str(o.startAt ?? o.start_at) ?? null,
    endAt: str(o.endAt ?? o.end_at) ?? null,
    maxParticipants: num(o.maxParticipants ?? o.max_participants) ?? 0,
    participantCount: num(o.participantCount ?? o.participant_count) ?? 0,
    readyCount: num(o.readyCount ?? o.ready_count) ?? 0,
    participants,
    lockedRosterUserIds: intArray(o.lockedRosterUserIds ?? o.locked_roster_user_ids),
    serverTime: num(o.serverTime ?? o.server_time) ?? Date.now(),
    msUntilStart: num(o.msUntilStart ?? o.ms_until_start) ?? 0,
    msUntilEnd: num(o.msUntilEnd ?? o.ms_until_end) ?? 0,
    inScheduledWindow: bool(o.inScheduledWindow ?? o.in_scheduled_window),
    rankGraceSeconds: num(o.rankGraceSeconds ?? o.rank_grace_seconds) ?? 30,
    suggestStartMeditation: bool(o.suggestStartMeditation ?? o.suggest_start_meditation),
    suggestStopMeditation: bool(o.suggestStopMeditation ?? o.suggest_stop_meditation),
    suggestPrepareSoon: bool(o.suggestPrepareSoon ?? o.suggest_prepare_soon),
  };
}

/** 从 `fetchActivityRoomResult` 的 resolve 值解析为强类型榜单 */
export function parseRoomResultFromResponse(res: unknown): ActivityRoomResultData | null {
  const raw = unwrapApiDataDeep<unknown>(res);
  if (!isRecord(raw)) return null;
  const o = raw;
  const activityId = num(o.activityId ?? o.activity_id);
  const phase = num(o.phase);
  if (activityId == null || phase == null) return null;

  const rk = o.rankings;
  const rankingsObj = isRecord(rk) ? rk : {};

  let avgHeartRate = mapRankingList(rankingsObj.avgHeartRate ?? rankingsObj.avg_heart_rate);
  let avgBreathRate = mapRankingList(rankingsObj.avgBreathRate ?? rankingsObj.avg_breath_rate);
  let movementCount = mapRankingList(rankingsObj.movementCount ?? rankingsObj.movement_count);

  const hasNew =
    avgHeartRate.length > 0 || avgBreathRate.length > 0 || movementCount.length > 0;
  if (!hasNew) {
    const legacyKeys = ["composite", "duration", "focus", "stability"] as const;
    for (const key of legacyKeys) {
      const rows = mapRankingList(rankingsObj[key]);
      if (rows.length > 0) {
        avgHeartRate = rows;
        avgBreathRate = rows;
        movementCount = rows;
        break;
      }
    }
  }

  return {
    activityId,
    phase,
    startAt: str(o.startAt ?? o.start_at) ?? "",
    endAt: str(o.endAt ?? o.end_at) ?? "",
    rankGraceSeconds: num(o.rankGraceSeconds ?? o.rank_grace_seconds) ?? 30,
    rankWindowStartAt: str(o.rankWindowStartAt ?? o.rank_window_start_at) ?? "",
    rankWindowEndAt: str(o.rankWindowEndAt ?? o.rank_window_end_at) ?? "",
    rosterUserIds: intArray(o.rosterUserIds ?? o.roster_user_ids),
    rankings: {
      avgHeartRate,
      avgBreathRate,
      movementCount,
    },
  };
}

/** 根据模板 ID 确定场景类型 */
export function sceneTypeForTemplate(templateId: number): SceneType {
  const m = templateId;
  return m === 1 ? "dark" : m === 2 ? "light" : m === 3 ? "simple" : "group";
}

/** `GET /app/activity/serverTime` */
export function parseServerTimeFromResponse(res: unknown): number | null {
  const raw = unwrapApiDataDeep<unknown>(res);
  if (!isRecord(raw)) return null;
  const t = num(raw.serverTime ?? raw.server_time);
  return t ?? null;
}
