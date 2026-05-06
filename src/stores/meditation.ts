/**
 * 禅修模块本地状态：首页活动偏好、最近一次禅修的时间/时长/音乐等（持久化，非用户表字段）。
 */
import { defineStore } from "pinia";
import { fetchMeditationSessionActive } from "@/assets/js/api/meditation";
import type { MeditationReport, MeditationSessionActiveData } from "@/types/api/meditation";
import { unwrapApiData } from "@/utils/apiResponse";

/** 禅修结束时写入的一条摘要（本地） */
export interface LastMeditationSessionPayload {
  /** 本次禅修开始时刻（ISO 8601） */
  startedAtIso: string;
  /** 计划时长（分钟） */
  plannedMinutes: number;
  /** 结束时的已进行秒数 */
  elapsedSec: number;
  trackId: string;
  trackTitle: string;
  trackUrl: string;
  /** 若均有效则同步更新首页活动偏好 */
  activityId?: number | null;
  activityTemplateId?: number | null;
}

/** 跳转禅修页前写入：复用持久化字段，与「上次练完」结构一致，无需单独 pending */
export interface NextMeditationLaunchPayload {
  durationMinutes: number;
  trackId: string;
  trackTitle: string;
  trackUrl: string;
  /** 为 false 时禅修页不拉设备实时数据（无设备模式）；缺省为 true */
  useHardwareDevice?: boolean;
  /** 场景卡进入时传入，会同步更新 `homePreferredActivity*`；右下角开始请勿传 */
  activityId?: number | null;
  activityTemplateId?: number | null;
  /**
   * 本次禅修结束后的报告页：首页等普通入口为心迹报告；共修等待室为共修榜单。
   * 缺省 `heart`；不持久化，由 `takePendingPostMeditationReport` 在静坐页 onLoad 消费。
   */
  postReport?: "heart" | "group";
}

export interface MeditationState {
  /**
   * 下一次进入禅修页是否使用硬件实时数据；由 `applyNextMeditationLaunch` 写入，**不持久化**。
   * 禅修页优先读 URL `d=`，无参数时读此字段。
   */
  pendingUseHardwareDevice: boolean;
  /** 最近一次完成禅修关联的活动 ID，用于首页横向列表排序与默认带入 */
  homePreferredActivityId: number | null;
  homePreferredActivityTemplateId: number | null;
  /** 最近一次禅修开始时间（ISO 8601） */
  lastMeditationStartedAt: string | null;
  /** 计划时长（分钟）：练前为将用时长，练后与 record 一致 */
  lastMeditationPlannedMinutes: number | null;
  /** 最近一次实际已进行秒数（结束时） */
  lastMeditationElapsedSec: number | null;
  lastMeditationTrackId: string | null;
  lastMeditationTrackTitle: string | null;
  lastMeditationTrackUrl: string | null;
  /**
   * 最近一次 `POST /app/meditation/end` 返回的报告；**不持久化**，报告页读取后应 `consume` 清空。
   */
  lastMeditationServerReport: MeditationReport | null;
  /**
   * `GET /app/meditation/session/active` 快照；**不持久化**，供首页/设置等提示「进行中的禅修」。
   */
  activeSessionInfo: MeditationSessionActiveData | null;
  /**
   * 下一次进入静坐页结束后的报告去向；**不持久化**。
   * `applyNextMeditationLaunch` 写入，静坐页 `onLoad` 调用 `takePendingPostMeditationReport` 读出并清空。
   */
  pendingPostMeditationReport: "heart" | "group" | null;
}

export const useMeditationStore = defineStore("meditation", {
  persist: {
    enabled: true,
    H5Storage: localStorage,
    strategies: [
      {
        key: "meditation_store",
        paths: [
          "homePreferredActivityId",
          "homePreferredActivityTemplateId",
          "lastMeditationStartedAt",
          "lastMeditationPlannedMinutes",
          "lastMeditationElapsedSec",
          "lastMeditationTrackId",
          "lastMeditationTrackTitle",
          "lastMeditationTrackUrl",
        ],
      },
    ],
  },
  state: (): MeditationState => ({
    pendingUseHardwareDevice: true,
    homePreferredActivityId: null,
    homePreferredActivityTemplateId: null,
    lastMeditationStartedAt: null,
    lastMeditationPlannedMinutes: null,
    lastMeditationElapsedSec: null,
    lastMeditationTrackId: null,
    lastMeditationTrackTitle: null,
    lastMeditationTrackUrl: null,
    lastMeditationServerReport: null,
    activeSessionInfo: null,
    pendingPostMeditationReport: null,
  }),
  getters: {
    /** 是否存在 `status=1` 的进行中会话 */
    hasActiveMeditationSession(): boolean {
      return this.activeSessionInfo?.hasActive === true;
    },
  },
  actions: {
    /** 拉取当前是否有进行中的冥想（5.0）；失败时不清空旧快照，避免闪烁 */
    async fetchActiveSession() {
      try {
        const res = await fetchMeditationSessionActive();
        const data = unwrapApiData<MeditationSessionActiveData | null>(res);
        if (data && typeof data.hasActive === "boolean") {
          this.activeSessionInfo = data;
        }
      } catch (e) {
        console.error("fetchMeditationSessionActive", e);
      }
    },

    /**
     * 进入禅修页前写入：更新 `lastMeditationPlannedMinutes`、三 track 字段；
     * 仅场景卡等需要指定活动时传 `activityId` / `activityTemplateId`（会写 homePreferred）。
     */
    applyNextMeditationLaunch(payload: NextMeditationLaunchPayload) {
      this.pendingUseHardwareDevice = payload.useHardwareDevice !== false;
      this.pendingPostMeditationReport = payload.postReport ?? "heart";
      this.lastMeditationPlannedMinutes = Math.max(1, Math.round(payload.durationMinutes));
      this.lastMeditationTrackId = payload.trackId || null;
      this.lastMeditationTrackTitle = payload.trackTitle || null;
      this.lastMeditationTrackUrl = payload.trackUrl || null;
      const aid = payload.activityId;
      const tid = payload.activityTemplateId;
      if (
        aid != null &&
        tid != null &&
        Number.isFinite(aid) &&
        Number.isFinite(tid)
      ) {
        this.homePreferredActivityId = aid;
        this.homePreferredActivityTemplateId = tid;
      }
    },

    /**
     * 禅修结束时写入：开始时间、计划/实际时长、音乐；若带有效活动 id 则更新首页活动偏好。
     */
    recordLastMeditationSession(payload: LastMeditationSessionPayload) {
      this.lastMeditationStartedAt = payload.startedAtIso;
      this.lastMeditationPlannedMinutes = Math.max(1, Math.round(payload.plannedMinutes));
      this.lastMeditationElapsedSec = Math.max(0, Math.floor(payload.elapsedSec));
      this.lastMeditationTrackId = payload.trackId || null;
      this.lastMeditationTrackTitle = payload.trackTitle || null;
      this.lastMeditationTrackUrl = payload.trackUrl || null;

      const aid = payload.activityId;
      const tid = payload.activityTemplateId;
      if (
        aid != null &&
        tid != null &&
        Number.isFinite(aid) &&
        Number.isFinite(tid)
      ) {
        this.homePreferredActivityId = aid;
        this.homePreferredActivityTemplateId = tid;
      }
    },

    /** 写入结束接口返回的报告，供报告页展示 */
    setLastMeditationServerReport(payload: MeditationReport | null) {
      this.lastMeditationServerReport = payload;
    },

    /** 报告页首屏读取并清空，避免重复展示旧数据 */
    consumeLastMeditationServerReport(): MeditationReport | null {
      const r = this.lastMeditationServerReport;
      this.lastMeditationServerReport = null;
      return r;
    },

    /** 静坐页 onLoad：取出本次结束应去的报告类型并清空 pending，缺省为心迹报告 */
    takePendingPostMeditationReport(): "heart" | "group" {
      const v = this.pendingPostMeditationReport ?? "heart";
      this.pendingPostMeditationReport = null;
      return v;
    },

    /** 登出等：清空禅修模块全部本地持久化字段 */
    clearHomeActivityPreference() {
      this.pendingUseHardwareDevice = true;
      this.pendingPostMeditationReport = null;
      this.homePreferredActivityId = null;
      this.homePreferredActivityTemplateId = null;
      this.lastMeditationStartedAt = null;
      this.lastMeditationPlannedMinutes = null;
      this.lastMeditationElapsedSec = null;
      this.lastMeditationTrackId = null;
      this.lastMeditationTrackTitle = null;
      this.lastMeditationTrackUrl = null;
      this.lastMeditationServerReport = null;
      this.activeSessionInfo = null;
    },
  },
});
