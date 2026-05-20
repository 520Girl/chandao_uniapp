<template>
    <view class="flex flex-col min-h-screen theme-bg cloud-pattern meditation-running">
        <lcrBar :title="'静坐中'" :leftIcon="'icon-arrow-left'" :handleClick="onTapStop" :type="'no'" :titleColor="'theme-color-1'" />
        <view class="flex-grow flex flex-col items-center justify-center px-6">
            <!-- <view class="h-24"></view> -->
            <view class="relative flex items-center justify-center">
                <view
                    class="w-72 h-72 rounded-full border border-theme-12 flex items-center justify-center breathing-glow breath-ring">
                    <view class="absolute inset-0 rounded-full border-[4px] border-theme-10 opacity-60 breath-halo">
                    </view>
                    <view class="flex flex-col items-center justify-center heartbeat-core" :style="{ transform: `scale(${beatScale})` }">
                        <text class="font-headline text-6xl tracking-tighter text-on-surface mb-2 tabular-nums">{{ remainTimeText }}</text>
                        <text class="font-body text-sm tracking-[0.2em] text-on-surface-variant font-medium">{{ breathPhaseText }}</text>
                    </view>
                </view>
            </view>
            <view class="mt-16 w-full max-w-lg mx-auto flex flex-col gap-5">
                <!-- 心率 / 呼吸（标题行 + 数值行均带 iconfont） -->
                <view class="flex flex-wrap justify-center gap-5">
                    <view class="flex flex-col items-center space-y-2 w-[300rpx]">
                        <view class="flex items-center justify-center gap-2">
                            <view class="iconfont icon-heart-fill text-[24rpx] text-[#e500003b]" />
                            <text class="font-label text-[20rpx] tracking-[0.15em] text-outline uppercase">心跳</text>
                        </view>
                        <view
                            class="w-full bg-surface-container-low px-4 py-2.5 rounded-[40rpx] flex items-center justify-center gap-2 shadow-sm border border-primary/5">
                            <view class="iconfont icon-heart-fill text-[36rpx] text-[#e500003b] shrink-0" />
                          <text class="font-label text-[28rpx] text-on-surface-variant font-semibold tabular-nums">{{ heartRateText }} bpm</text>
                        </view>
                    </view>
                    <view class="flex flex-col items-center space-y-2 w-[300rpx]">
                        <view class="flex items-center justify-center gap-2">
                            <view class="iconfont icon-wind text-[24rpx] theme-color-1" />
                            <text class="font-label text-[20rpx] tracking-[0.15em] text-outline uppercase">呼吸</text>
                        </view>
                        <view
                            class="w-full bg-surface-container-low px-4 py-2.5 rounded-[40rpx] flex items-center justify-center gap-2 shadow-sm border border-primary/5">
                            <view class="iconfont icon-wind text-[36rpx] theme-color-1 shrink-0" />
                          <text class="font-label text-[28rpx] text-on-surface-variant font-semibold tabular-nums">{{ breathRateText }} brpm</text>
                        </view>
                    </view>
                </view>
                <!-- 体动 / 在床·离床（大图标底 + iconfont） -->
                <view class="grid grid-cols-2 gap-3 px-1">
                    <view
                        class="rounded-[36rpx] px-2.5 py-3 flex items-center gap-2.5 border transition-colors duration-300"
                        :class="
                            currentIsBodyMovement
                                ? 'border-amber-400/45 bg-amber-500/[0.12]'
                                : 'border-theme-12 bg-surface-container-low/90'
                        ">
                        <view
                            class="size-[88rpx] rounded-2xl flex items-center justify-center shrink-0 bg-white/70 dark:bg-white/10 border border-black/5">
                            <view
                                class="iconfont icon-tidong text-[48rpx] leading-none"
                                :class="currentIsBodyMovement ? 'text-amber-600' : 'theme-color-1 opacity-85'" />
                        </view>
                        <view class="flex flex-col min-w-0 flex-1">
                            <text class="font-label text-[18rpx] tracking-[0.12em] text-outline uppercase">体动</text>
                            <text class="text-[26rpx] font-semibold text-on-surface leading-tight mt-0.5">
                                {{ currentIsBodyMovement ? '有体动' : '静息' }}
                            </text>
                        </view>
                    </view>
                    <view
                        class="rounded-[36rpx] px-2.5 py-3 flex items-center gap-2.5 border transition-colors duration-300"
                        :class="
                        !hasMeditationDevice
                          ? 'border-theme-12 bg-surface-container-low/90'
                          : currentIsBed
                                ? 'border-emerald-400/40 bg-emerald-500/[0.1]'
                                : 'border-orange-300/45 bg-orange-500/[0.1]'
                        ">
                        <view
                            class="size-[88rpx] rounded-2xl flex items-center justify-center shrink-0 bg-white/70 dark:bg-white/10 border border-black/5">
                        <view
                          v-if="!hasMeditationDevice"
                          class="iconfont icon-sensors text-[48rpx] leading-none theme-color-1 opacity-70" />
                            <view
                          v-else-if="currentIsBed"
                                class="iconfont icon-zhihuifuyou_chankangyuyuemianxing text-[48rpx] leading-none text-emerald-600" />
                            <view
                                v-else
                                class="iconfont  icon-a-icon-dianzi1 text-[48rpx] leading-none text-orange-600" />
                        </view>
                        <view class="flex flex-col min-w-0 flex-1">
                            <text class="font-label text-[18rpx] tracking-[0.12em] text-outline uppercase">体姿</text>
                            <text class="text-[26rpx] font-semibold text-on-surface leading-tight mt-0.5">
                          {{ postureText }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="flex items-center justify-center text-[28rpx] tracking-[0.2em] theme-color-8">{{ elapsedMinuteText }}</view>
        </view>
        <view class="mt-auto px-8 pb-12 w-full flex flex-col space-y-8">
            <view class="flex items-end justify-between">
                <view class="space-y-1 flex-1">
                    <view class="font-body text-[10px] tracking-widest text-outline uppercase">正在播放</view>
                    <view class="font-headline text-2xl text-on-surface italic line-clamp-1">{{ trackTitle || '深夜觉察' }}</view>
                </view>
                <view
                    class="button-transition w-16 h-16 rounded-full glass-effect flex items-center justify-center shadow-lg "
                    @click="showConfirmDialog = true">
                    <text class="iconfont icon-pause text-[80rpx] text-primary"></text>
                </view>
            </view>
            <view class="h-[4rpx] w-full bg-surface-container-highest/30 rounded-full overflow-hidden">
                <view class="h-full bg-theme-2 progress-anim" :style="{ width: `${progressPercent}%` }"></view>
            </view>
        </view>
        <ConfirmDialog
        v-model:show="showConfirmDialog"
        title="是否结束禅修？"
        message="结束禅修后将生成禅修报告，是否继续？"
        cancel-text="继续"
        confirm-text="结束"
        :mask-closable="true"
        :show-close="true"
        @cancel="onTapStop(false)"
        @confirm="onTapStop(true)" />
    </view>
</template>

<script setup lang="ts">
import {
  endMeditation as postMeditationEnd,
  fetchMeditationReportDetail,
  pollMeditation,
  startMeditation,
} from '@/assets/js/api/meditation';
import lcrBar from '@/components/lcrBar.vue';
import ConfirmDialog from '@/components/common/confirmDialog.vue';
import { useDeviceStore } from '@/stores/device';
import { useMeditationStore } from '@/stores/meditation';
import type {
  MeditationEndResult,
  MeditationReport,
  MeditationStartDTO,
  MeditationStartResult,
  MeditationPollRespEnvelope,
  MeditationPollRespDataItem,
} from '@/types/api/meditation';
import { unwrapApiData } from '@/utils/apiResponse';
import { parseMeditationReportDetailPayload } from '@/utils/meditationReport';
import { resolveMusicAssetUrl } from '@/utils/musicPage';
import {
  isLeavingMeditationForReportPage,
  playMeditationEndMusicLinearFadeIn,
  prepareMeditationSessionEnd,
  setLeavingMeditationForReportPage,
  startMeditationBackground,
  stopMeditationBackgroundMusic,
} from '@/utils/meditationBackgroundMusic';

type RealtimeStat = {
  heartRate: number;
  breathRate: number;
  isBed: boolean;
  isBodyMovement: boolean;
};

const targetMinutes = ref(15);
const trackId = ref('');
const trackTitle = ref('疗愈音频');
const trackUrl = ref('');
/** 后端会话 ID，用于 `poll` / `end` */
const sessionNumericId = ref(0);
/**
 * 轮询间隔（毫秒）：来自 `POST /app/meditation/start` 的 `pollInterval`（或兼容字段 `pollDelayMs`），
 * 供 `startPollLoop` 里 `setInterval` 节拍调用 `poll`，直到会话 `ended` 或本地结束。
 */
const pollDelayMs = ref(5000);
/** 首页选择：是否使用外接设备（决定 `start.type` 与是否解析 `poll.resp`） */
const hasMeditationDevice = ref(true);
const showConfirmDialog = ref(false);
/** 进入本页时刻，用于写入禅修 store 的「开始时间」 */
let sessionStartedAtMs = 0;

const elapsedSec = ref(0);
const remainSec = ref(15 * 60);
const currentHeartRate = ref(72);
const currentBreathRate = ref(12);
const currentIsBed = ref(false);
const currentIsBodyMovement = ref(false);
const statSamples = ref<RealtimeStat[]>([]);

let timerId: ReturnType<typeof setInterval> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
/** 防止 `pollDelayMs` 节拍与单次请求耗时重叠导致并发 poll */
let pollInFlight = false;
let ended = false;

function enableKeepScreenOn() {
  try {
    uni.setKeepScreenOn({ keepScreenOn: true });
  } catch {
    /* noop */
  }
}

function disableKeepScreenOn() {
  try {
    uni.setKeepScreenOn({ keepScreenOn: false });
  } catch {
    /* noop */
  }
}

/** 启动后台静音保活（`/static/silence.mp3`），与疗愈音无关；结束音乐用独立 InnerAudio。 */
function startMeditationBgMusic() {
  startMeditationBackground({
    title: trackTitle.value || '禅修静音保活',
    epname: '禅修',
    singer: '静心',
    coverImgUrl: '/static/logo.png',
  });
}

const meditationStore = useMeditationStore();
/** 首页带入的活动，禅修正常结束后写入禅修模块偏好（Pinia 持久化） */
let sessionActivityId: number | null = null;
let sessionActivityTemplateId: number | null = null;
/** 结束跳转：由 `applyNextMeditationLaunch.postReport` 决定，onLoad 时从 store 取出 */
let sessionPostReportKind: 'heart' | 'group' = 'heart';

const progressPercent = computed(() => {
  const total = Math.max(1, targetMinutes.value * 60);
  return Math.min(100, (elapsedSec.value / total) * 100);
});

const remainTimeText = computed(() => {
  const safe = Math.max(0, remainSec.value);
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
});

const elapsedMinuteText = computed(() => `已进行 ${Math.floor(elapsedSec.value / 60)} 分 ${elapsedSec.value % 60} 秒`);

const breathPhaseText = computed(() => {
  const cycle = elapsedSec.value % 8;
  if (cycle < 4) return '吸气';
  return '呼气';
});

const heartRateText = computed(() =>
  hasMeditationDevice.value ? formatPhysio2(currentHeartRate.value) : '0',
);

const breathRateText = computed(() =>
  hasMeditationDevice.value ? formatPhysio2(currentBreathRate.value) : '0',
);

const postureText = computed(() => {
  if (!hasMeditationDevice.value) return '无状态';
  return currentIsBed.value ? '在座' : '离座';
});

const beatScale = computed(() => {
  const phase = (elapsedSec.value * currentHeartRate.value) % 60;
  return phase < 18 ? 1.05 : 1;
});

function toSafeInt(v: unknown, fallback: number) {
  const n = Number(v);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.round(n));
}

/** 心率 / 呼吸展示与报告 URL：固定保留两位小数 */
function formatPhysio2(v: number): string {
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

/**
 * 从 `poll.resp` 取出用于解析生理指标的行：有 `data[]` 时用最后一条（最新），否则用顶层（兼容）。
 */
function resolvePollPhysiologyRow(resp: MeditationPollRespEnvelope): MeditationPollRespDataItem | null {
  if (resp == null || typeof resp !== 'object') return null;
  const r = resp as MeditationPollRespEnvelope;
  const data = r.data;
  let last = null;
  //判断那边有数据
  if (Array.isArray(data) && data.length > 0) {
    last = data[data.length - 1] as MeditationPollRespDataItem;
  }
  return last;
}

function clampPhysio(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** 从 `poll` 返回的 `resp`（设备云：`data[].left` 等）解析心率、呼吸率（保留小数，仅做范围钳制） */
function parsePollPhysiology(resp: MeditationPollRespEnvelope): RealtimeStat | null {
  const row = resolvePollPhysiologyRow(resp);
  if (!row) return null;
  const left = row.left;
  const right = row.right;
  const pickSide =
    left && right && left.respiration_rate === 0 ? right : (left ?? right);
  if (!pickSide) return null;
  const hrNum = Number(pickSide.heart_rate);
  const brNum = Number(pickSide.respiration_rate);
  if (!Number.isFinite(hrNum) || !Number.isFinite(brNum)) return null;
  return {
    heartRate: clampPhysio(hrNum, 40, 180),
    breathRate: clampPhysio(brNum, 6, 40),
    isBed: row.inbed ?? false,
    isBodyMovement: row.body_movement ?? false
  };
}

function mockRealtime() {
  const hr = currentHeartRate.value + (Math.random() - 0.5) * 1.6;
  const br = currentBreathRate.value + (Math.random() - 0.5) * 0.8;
  return {
    heartRate: clampPhysio(hr, 55, 95),
    breathRate: clampPhysio(br, 8, 20),
    isBed: currentIsBed.value,
    isBodyMovement: currentIsBodyMovement.value
  };
}

function buildMeditationStartBody(targetDuration: number): MeditationStartDTO {
  if (!hasMeditationDevice.value) {
    return { type: 2, targetDuration };
  }
  const ds = useDeviceStore();
  const sn =
    ds.devices
      .find((x) => x.statusCode === 1 && String(x.sn ?? '').trim() !== '')
      ?.sn?.trim() ||
    ds.devices.find((x) => String(x.sn ?? '').trim() !== '')?.sn?.trim();
  if (!sn) {
    return { type: 2, targetDuration };
  }
  return { type: 1, sn, targetDuration };
}

function clearPollTimer() {
  if (pollTimer != null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function startRemoteSession() {
  const body = buildMeditationStartBody(targetMinutes.value);
  if (hasMeditationDevice.value && body.type === 2) {
    hasMeditationDevice.value = false;
    uni.showToast({ title: '未找到设备 SN，已切换无设备禅修', icon: 'none' });
  }
  try {
    const res = await startMeditation(body);
    const data = unwrapApiData<MeditationStartResult>(res);
    const sid = Number(data?.sessionId ?? data?.id);
    sessionNumericId.value = Number.isFinite(sid) && sid > 0 ? sid : 0;
    const pi = Number(data?.pollInterval ?? data?.pollDelayMs);
    pollDelayMs.value = Number.isFinite(pi) && pi > 0 ? Math.min(60_000, Math.max(2000, Math.round(pi))) : 5000;
    if (sessionNumericId.value <= 0) {
      throw new Error('missing session id');
    }
  } catch (e) {
    console.error('startMeditation', e);
    uni.showToast({ title: '无法开始禅修', icon: 'none' });
    setTimeout(() => uni.navigateBack(), 1200);
    throw e;
  }
}

/**
 * 单次 `POST /app/meditation/poll`：同步 `elapsed`、生理数；若 `status=ended` 则结束禅修。
 */
async function doOnePoll() {
  if (ended || sessionNumericId.value <= 0) return;

  try {
    const res = await pollMeditation({ sessionId: sessionNumericId.value });
    const raw = unwrapApiData<Record<string, unknown>>(res);
    if (!raw || typeof raw.status !== 'string') return;

    if (raw.status === 'ended') {
      await finishMeditationSession();
      return;
    }

    if (raw.status === 'ongoing') {
      const elapsed = Number(raw.elapsed);
      if (!Number.isNaN(elapsed) && elapsed >= 0) {
        const cap = targetMinutes.value * 60;
        elapsedSec.value = Math.min(Math.floor(elapsed), cap);
        remainSec.value = Math.max(0, cap - elapsedSec.value);
      }

      if (!hasMeditationDevice.value) {
        currentHeartRate.value = 0;
        currentBreathRate.value = 0;
        currentIsBed.value = false;
        currentIsBodyMovement.value = false;
        statSamples.value.push({
          heartRate: 0,
          breathRate: 0,
          isBed: false,
          isBodyMovement: false,
        });
        return;
      }

      const respEmpty = raw.resp == null;
      const deviceStatusId = Number(raw.deviceStatusId);

      /** `resp` 无包体且设备态为离床（3）：界面固定为离床、静息、生理 0（不入采样以免拉低报告均值） */
      if (hasMeditationDevice.value && respEmpty && deviceStatusId === 3) {
        currentHeartRate.value = 0;
        currentBreathRate.value = 0;
        currentIsBed.value = false;
        currentIsBodyMovement.value = false;
      } else {
        let latest: RealtimeStat;
        if (hasMeditationDevice.value) {
          const parsed = respEmpty
            ? null
            : parsePollPhysiology(raw.resp as MeditationPollRespEnvelope);
          latest = parsed ?? mockRealtime();
        } else {
          latest = mockRealtime();
        }
        currentHeartRate.value = latest.heartRate;
        currentBreathRate.value = latest.breathRate;
        currentIsBed.value = latest.isBed;
        currentIsBodyMovement.value = latest.isBodyMovement;
        statSamples.value.push(latest);
      }
    }
  } catch (e) {
    console.error('pollMeditation', e);
    if (!hasMeditationDevice.value) {
      currentHeartRate.value = 0;
      currentBreathRate.value = 0;
      currentIsBed.value = false;
      currentIsBodyMovement.value = false;
      statSamples.value.push({
        heartRate: 0,
        breathRate: 0,
        isBed: false,
        isBodyMovement: false,
      });
    }
  }
}

/**
 * 按墙钟节拍拉 `poll`（`setInterval`）：先立即跑一轮，再每隔 `pollDelayMs` 触发；
 * 若上一轮尚未结束则跳过本次 tick，避免并发。注意：小程序后台仍可能整体节流定时器，与音频后台能力无关。
 */
async function tickPoll() {
  if (ended || sessionNumericId.value <= 0) return;
  if (pollInFlight) return;
  pollInFlight = true;
  try {
    await doOnePoll();
  } catch (e) {
    console.error('tickPoll', e);
  } finally {
    pollInFlight = false;
  }
}

function startPollLoop() {
  clearPollTimer();
  void tickPoll();
  pollTimer = setInterval(() => void tickPoll(), pollDelayMs.value);
}

function getAvg(list: number[]) {
  if (!list.length) return 0;
  return list.reduce((a, b) => a + b, 0) / list.length;
}

async function finishMeditationSession() {
  if (ended) return;
  ended = true;
  disableKeepScreenOn();
  clearPollTimer();
  if (timerId) clearInterval(timerId);
  timerId = null;

  const fetchReportAndStore = async () => {
    let reportDetail: MeditationReport | null = null;
    if (sessionNumericId.value > 0) {
      try {
        const endRes = await postMeditationEnd({ sessionId: sessionNumericId.value });
        const endData = unwrapApiData<MeditationEndResult | null>(endRes);
        const sid = Number(endData?.sessionId ?? sessionNumericId.value);
        if (Number.isFinite(sid) && sid > 0) {
          const detailRes = await fetchMeditationReportDetail({ sessionId: sid });
          const rawDetail = unwrapApiData<unknown>(detailRes);
          reportDetail = parseMeditationReportDetailPayload(rawDetail);
        }
      } catch (e) {
        console.error('postMeditationEnd / fetchMeditationReportDetail', e);
      }
    }
    meditationStore.setLastMeditationServerReport(reportDetail);

    const startedIso =
      sessionStartedAtMs > 0
        ? new Date(sessionStartedAtMs).toISOString()
        : new Date().toISOString();
    meditationStore.recordLastMeditationSession({
      startedAtIso: startedIso,
      plannedMinutes: targetMinutes.value,
      elapsedSec: elapsedSec.value,
      trackId: trackId.value,
      trackTitle: trackTitle.value,
      trackUrl: trackUrl.value,
      activityId: sessionActivityId,
      activityTemplateId: sessionActivityTemplateId,
    });
  };

  await fetchReportAndStore();

  prepareMeditationSessionEnd();
  setLeavingMeditationForReportPage(true);

  const endUrl = resolveMusicAssetUrl(trackUrl.value);
  if (endUrl) {
    void playMeditationEndMusicLinearFadeIn(endUrl);
  }

  const query = [
    sessionNumericId.value > 0 ? `sessionId=${sessionNumericId.value}` : '',
  ]
    .filter(Boolean)
    .join('&');

  const goReport = () => {
    const aidInner = sessionActivityId ?? meditationStore.homePreferredActivityId ?? null;
    if (sessionPostReportKind === 'group' && aidInner != null && aidInner > 0) {
      uni.redirectTo({
        url: `/pages/community/activity-group-report?id=${aidInner}`,
      });
      return;
    }
    uni.redirectTo({
      url: `/pages/meditation/report?${query}`,
    });
  };

  goReport();
}

function onTapStop(hasDevice: boolean) {
  if (!hasDevice) return;
  void finishMeditationSession();
}

onLoad((query) => {
  setLeavingMeditationForReportPage(false);
  const q = query || {};
  sessionStartedAtMs = Date.now();

  /** 有/无设备：优先 URL `d=0|1`（外链兼容），否则读禅修 store 中 `applyNextMeditationLaunch` 写入的标记 */
  hasMeditationDevice.value = meditationStore.pendingUseHardwareDevice;
  const rawD = q.d ?? q.hasDevice;
  if (rawD === '0' || rawD === 0) {
    hasMeditationDevice.value = false;
  } else if (rawD === '1' || rawD === 1) {
    hasMeditationDevice.value = true;
  }

  if (!hasMeditationDevice.value) {
    currentHeartRate.value = 0;
    currentBreathRate.value = 0;
    currentIsBed.value = false;
    currentIsBodyMovement.value = false;
  }

  /** 时长、音乐、活动：优先 Pinia（复用 last* / homePreferred*），query 仅作外链兼容 */
  const pm = meditationStore.lastMeditationPlannedMinutes;
  const hasQDuration = q.duration != null && String(q.duration) !== '';
  targetMinutes.value = hasQDuration
    ? toSafeInt(q.duration, 15)
    : pm != null
      ? toSafeInt(pm, 15)
      : 15;
  remainSec.value = targetMinutes.value * 60;

  trackId.value =
    (q.trackId != null && String(q.trackId) !== ''
      ? String(q.trackId)
      : meditationStore.lastMeditationTrackId) || '';
  const hasQTitle = q.trackTitle != null && String(q.trackTitle).trim() !== '';
  trackTitle.value = hasQTitle
    ? decodeURIComponent(String(q.trackTitle))
    : meditationStore.lastMeditationTrackTitle || '疗愈音频';
  try {
    trackUrl.value =
      q.trackUrl != null && String(q.trackUrl) !== ''
        ? decodeURIComponent(String(q.trackUrl))
        : meditationStore.lastMeditationTrackUrl || '';
  } catch {
    trackUrl.value =
      q.trackUrl != null && String(q.trackUrl) !== ''
        ? String(q.trackUrl)
        : meditationStore.lastMeditationTrackUrl || '';
  }
  const qAid = q.activityId;
  const qTid = q.activityTemplateId;
  if (qAid != null && qAid !== '' && qTid != null && qTid !== '') {
    const aid = Number(qAid);
    const tid = Number(qTid);
    sessionActivityId = Number.isFinite(aid) ? aid : null;
    sessionActivityTemplateId = Number.isFinite(tid) ? tid : null;
  } else {
    sessionActivityId = meditationStore.homePreferredActivityId;
    sessionActivityTemplateId = meditationStore.homePreferredActivityTemplateId;
  }

  sessionPostReportKind = meditationStore.takePendingPostMeditationReport();

  void bootstrapMeditation();
  // #ifdef H5
  installH5BackGuard();
  // #endif
});

/** 拦截系统返回键 / 小程序返回：不直接出页，与暂停键一致弹出「是否结束」 */
onBackPress(() => {
  if (ended) return false;
  showConfirmDialog.value = true;
  return true;
});

let h5PopStateHandler: (() => void) | null = null;

function installH5BackGuard() {
  if (typeof window === 'undefined' || h5PopStateHandler) return;
  const push = () => {
    try {
      history.pushState({ _meditationGuard: 1 }, '', location.href);
    } catch {
      /* noop */
    }
  };
  h5PopStateHandler = () => {
    if (ended) return;
    showConfirmDialog.value = true;
    push();
  };
  window.addEventListener('popstate', h5PopStateHandler);
  push();
}

function uninstallH5BackGuard() {
  if (typeof window === 'undefined' || !h5PopStateHandler) return;
  window.removeEventListener('popstate', h5PopStateHandler);
  h5PopStateHandler = null;
}

async function bootstrapMeditation() {
  enableKeepScreenOn();
  uni.showLoading({ title: '准备中…', mask: true });
  try {
    await startRemoteSession();
  } catch {
    disableKeepScreenOn();
    return;
  } finally {
    uni.hideLoading();
  }

  timerId = setInterval(() => {
    elapsedSec.value += 1;
    remainSec.value = Math.max(0, targetMinutes.value * 60 - elapsedSec.value);
    if (remainSec.value <= 0) {
      void finishMeditationSession();
    }
  }, 1000);

  startPollLoop();
  startMeditationBgMusic();
}

onUnload(() => {
  // #ifdef H5
  uninstallH5BackGuard();
  // #endif
  disableKeepScreenOn();
  if (timerId) clearInterval(timerId);
  timerId = null;
  clearPollTimer();
  if (!isLeavingMeditationForReportPage()) {
    stopMeditationBackgroundMusic();
  }
});

onBeforeUnmount(() => {
  // #ifdef H5
  uninstallH5BackGuard();
  // #endif
  disableKeepScreenOn();
  if (timerId) clearInterval(timerId);
  timerId = null;
  clearPollTimer();
  if (!isLeavingMeditationForReportPage()) {
    stopMeditationBackgroundMusic();
  }
});
</script>

<style scoped lang="scss">
.heartbeat-core {
  transition: transform 0.15s ease-out;
}

.progress-anim {
  transition: width 0.25s ease;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

@keyframes breath-ring {
  0%,
  100% {
    transform: scale(0.94);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.85;
  }
}

@keyframes breath-halo {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.38;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.breath-ring {
  animation: breath-ring 4s ease-in-out infinite;
}

.breath-halo {
  animation: breath-halo 8s ease-in-out infinite;
}
</style>