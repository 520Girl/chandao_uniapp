<template>
  <view class="flex flex-col min-h-screen theme-bg cloud-pattern overflow-hidden">
    <lcrBar :title="'共修等待室'" :on-back="onBack" :type="navBarType" />

    <!-- Main scene -->
    <view class="flex flex-col items-center justify-start pt-6 pb-4 px-6 relative">
      <!-- Subtitle -->
      <view class="text-center mb-10">
        <view class="font-serif italic text-4xl text-on-surface mb-2 line-clamp-2">{{ titleDisplay }}</view>
        <text class="font-label text-[20rpx] uppercase tracking-[0.35rem] theme-color-6">灵动流转版</text>
        <view v-if="roomLoading && !room" class="mt-3 text-[24rpx] theme-color-8">房间数据加载中…</view>
        <view
          v-else-if="roomError"
          class="mt-3 text-[24rpx] text-red-600/90 active:opacity-80"
          @tap="retryLoadRoom">
          {{ roomError }}（点击重试）
        </view>
        <view v-else-if="room" class="mt-3 text-[22rpx] theme-color-7 leading-relaxed px-2">
          <text class="block">{{ roomStatsLine }}</text>
          <text v-if="scheduleSummary" class="block mt-1 opacity-90">{{ scheduleSummary }}</text>
          <text v-if="roomFlagsLine" class="block mt-1 text-[20rpx] opacity-80">{{ roomFlagsLine }}</text>
        </view>
        <view v-else-if="!userStore.isLoggedIn" class="mt-3 text-[24rpx] theme-color-8">登录后可查看房间人数、就绪与倒计时</view>
      </view>

      <!-- Avatar Orbit Scene：成员头像由接口 participants 驱动，种子随机散布 -->
      <view class="relative w-full scatter-stage" :style="{ height: orbitHeightRpx + 'rpx' }">
        <view class="ripple-ring ripple-1" />
        <view class="ripple-ring ripple-2" />
        <view class="ripple-ring ripple-3" />

        <view class="center-orb">
          <view class="flex justify-center items-end flex-row" style="gap: 4rpx;">
            <text class="block font-headline text-[80rpx] italic theme-color-1 leading-none">{{ centerReady }}</text>
            <text class="block font-headline text-[30rpx] italic theme-color-1 leading-none">/{{ centerCap }}</text>
          </view>

          <text class="font-label text-[18rpx] tracking-[0.25rem] theme-color-6 uppercase">{{ phaseSubtitle }}</text>
        </view>

        <view
          v-for="(slot, idx) in scatteredAvatarSlots"
          :key="'p-' + slot.userId"
          class="scatter-avatar"
          :class="'scatter-float-' + ((idx % 4) + 1)"
          :style="{
            left: slot.leftPct + '%',
            top: slot.topPct + '%',
            zIndex: 6 + idx,
            animationDelay: slot.animDelay + 's',
          }">
          <view class="relative flex flex-col items-center">
            <view
              class="seat-avatar-wrap border-solid shadow-md overflow-hidden bg-white/90"
              :class="slot.ready ? 'border-theme-1 shadow-gold' : 'border-theme-color-3 opacity-90'"
              :style="{ width: slot.sizeRpx + 'rpx', height: slot.sizeRpx + 'rpx', borderWidth: '3rpx' }">
              <image class="w-full h-full rounded-full" :src="slot.src" mode="aspectFill" />
            </view>
            <view v-if="slot.isYou" class="you-badge">
              <text class="font-label text-[16rpx] text-white tracking-widest">YOU</text>
            </view>
            <text
              class="block text-center font-label text-[16rpx] theme-color-6 uppercase tracking-widest mt-1 max-w-[140rpx] line-clamp-1">
              {{ slot.label }}
            </text>
          </view>
        </view>

        <view class="absolute top-0 left-1/3 w-[2rpx] h-[100rpx] decor-line" />
        <view class="absolute bottom-[80rpx] right-1/3 w-[140rpx] h-[140rpx] rounded-full decor-circle" />
      </view>

      <!-- Quote -->
      <view class="mt-6 px-6 text-center">
        <text class="font-headline italic text-[28rpx] theme-color-7 leading-relaxed">
          "流转的是时间，静止的是心。{{ "\n" }}在此共处，即便无言，亦有回响。"
        </text>
      </view>
    </view>

    <!-- Bottom Control Panel -->
    <view class="control-panel mt-4 mx-4">
      <view class="flex flex-col" style="gap: 32rpx;">
        <!-- Music Player：与首页一致拉疗愈音乐列表，可试听播放 -->
        <view class="flex items-center justify-between">
          <view class="flex items-center min-w-0" style="gap: 24rpx;">
            <view class="eq-icon-wrap shrink-0" @tap="toggleHouseMusicPlay">
              <text
                :class="housePlayingId ? 'iconfont icon-pause' : 'iconfont icon-bofang'"
                class="theme-color-1 text-[40rpx]" />
            </view>
            <view class="min-w-0 flex-1">
              <text class="block font-label text-[20rpx] tracking-widest theme-color-5 uppercase font-bold truncate">疗愈音乐</text>
              <text class="block font-headline italic text-[28rpx] theme-color-1 truncate">{{ houseTrackTitle }}</text>
              <text v-if="houseMusicLoading" class="block text-[20rpx] theme-color-8 mt-1 truncate">音乐加载中…</text>
              <text v-else-if="houseMusicHint" class="block text-[20rpx] theme-color-8 mt-1 truncate">{{ houseMusicHint }}</text>
            </view>
          </view>

          <view class="flex items-center shrink-0" style="gap: 16rpx;">
            <view class="ctrl-btn-sm" @tap="onPrevHouseTrack">
              <text class="iconfont icon-prev theme-color-1 text-[36rpx]" />
            </view>
            <view class="ctrl-btn-play" @tap="toggleHouseMusicPlay">
              <text
                :class="housePlayingId ? 'iconfont icon-pause' : 'iconfont icon-daochu1024-15'"
                class="text-white text-[36rpx]" />
            </view>
            <view class="ctrl-btn-sm" @tap="onNextHouseTrack">
              <text class="iconfont icon-next theme-color-1 text-[36rpx]" />
            </view>
          </view>
        </view>

        <!-- CTA：待开场且已就绪时使用金色强调样式 -->
        <view class="cta-btn" :class="{ 'cta-btn--ready': showReadyCtaStyle }" @tap="onCtaTap">
          <text
            class="font-label text-[24rpx] tracking-[0.3rem] uppercase font-bold"
            :class="showReadyCtaStyle ? 'theme-color-1' : 'theme-color-5'">
            {{ ctaMainText }}
          </text>
          <text
            class="iconfont icon-nest_clock_farsight_analog_24dp_595959_FILL0_wght4 text-[32rpx]"
            :class="showReadyCtaStyle ? 'theme-color-1' : 'theme-color-6'" />
        </view>
      </view>
    </view>

    <ConfirmDialog
      v-model:show="showMeditationDevicePopup"
      title="选择禅修方式"
      :message="meditationDeviceDialogMessage"
      cancel-text="无设备"
      confirm-text="有设备"
      :mask-closable="true"
      :show-close="true"
      @cancel="confirmStartMeditationWithDevice(false)"
      @confirm="confirmStartMeditationWithDevice(true)"
      @dismiss="showMeditationDevicePopup = false" />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import {
  fetchActivityDetail,
  fetchActivityRoomState,
  fetchActivityServerTime,
  postActivityCheckin,
  postActivityReady,
} from "@/assets/js/api/activity";
import { fetchDeviceStatus } from "@/assets/js/api/device";
import { getMusicPage } from "@/assets/js/api/user";
import { config } from "@/assets/js/config";
import ConfirmDialog from "@/components/common/confirmDialog.vue";
import lcrBar from "@/components/lcrBar.vue";
import { useDeviceStore } from "@/stores/device";
import { useMeditationStore, type NextMeditationLaunchPayload } from "@/stores/meditation";
import { useUserStore } from "@/stores/user";
import type { ActivityDetail, ActivityRoomParticipant, ActivityRoomStateData } from "@/types/api/activity";
import type { MusicPageData } from "@/types/api/music";
import type { DeviceStatusAppData } from "@/types/api/device";
import { parseRoomStateFromResponse, parseServerTimeFromResponse } from "@/utils/activityRoomPayload";
import { unwrapApiData } from "@/utils/apiResponse";
import { mapApiStatusToLabel, normalizeDeviceStatusCode } from "@/utils/deviceMap";
import { mapMusicListItemToRow, type MusicTrackRow } from "@/utils/musicPage";
import { navigateBack } from "@/utils/navigation";

const PLACEHOLDER = "/static/logo.png";

const HOUSE_MUSIC_PAGE_SIZE = 20;
const HOUSE_COVER_CLASS_CYCLE = [
  "bg-gradient-to-br from-primary/30 to-background-dark/20",
  "bg-blue-100 dark:bg-blue-900/20",
  "bg-green-100 dark:bg-green-900/20",
  "bg-purple-100 dark:bg-purple-900/20",
] as const;

/** 稳定伪随机：同一用户在同一活动下位置固定，刷新房间后才随列表变 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const userStore = useUserStore();
const meditationStore = useMeditationStore();
const deviceStore = useDeviceStore();
const { devices: deviceListForHouse } = storeToRefs(deviceStore);

const activityId = ref(0);
const templateId = ref(0);
const targetMeditationSeconds = ref(0);

const room = ref<ActivityRoomStateData | null>(null);
const displayStartMs = ref(0);
const displayEndMs = ref(0);
const roomLoading = ref(false);
const roomError = ref("");
const fallbackTitle = ref("");
/** 活动详情起止（`targetMeditationSeconds` 为空时用于推算整场秒数） */
const activityDetailStart = ref<string | null>(null);
const activityDetailEnd = ref<string | null>(null);

const showMeditationDevicePopup = ref(false);
const readySubmitting = ref(false);
const tipsShown = new Set<string>();

let pollTimer: ReturnType<typeof setInterval> | null = null;
let tickTimer: ReturnType<typeof setInterval> | null = null;
/** 页面销毁时自增，用于丢弃仍在飞行中的 `fetchActivityRoomState` 结果，避免写回已卸载页 */
let roomStateFetchEpoch = 0;

const meditationDeviceDialogMessage = computed(() => deviceStore.meditationDeviceHint);

const houseAudioTracks = ref<MusicTrackRow[]>([]);
const houseSelectedTrackId = ref<string | null>(null);
const housePlayingId = ref<string | null>(null);
const houseMusicHint = ref("");
const houseMusicLoading = ref(false);
let houseInnerAudio: UniApp.InnerAudioContext | null = null;
// #ifdef MP-WEIXIN
let houseBgAudio: UniApp.BackgroundAudioManager | null = null;
let houseBgEndedHandler: (() => void) | null = null;
let houseBgErrorHandler: ((err: unknown) => void) | null = null;
// #endif

const orbitHeightRpx = computed(() => {
  const n = room.value?.participants?.length ?? 0;
  return Math.min(980, 560 + Math.max(0, n - 5) * 36);
});

const scatteredAvatarSlots = computed(() => {
  const list = [...(room.value?.participants ?? [])];
  const aid = room.value?.activityId ?? activityId.value ?? 0;
  const uid = myUserId.value;
  list.sort((a, b) => {
    const ka = ((a.userId * 1597334677) ^ aid) >>> 0;
    const kb = ((b.userId * 3812015801) ^ aid) >>> 0;
    if (ka !== kb) return ka > kb ? 1 : -1;
    return a.userId - b.userId;
  });
  return list.map((p, i) => {
    const rnd = mulberry32(((aid ^ p.userId) * 747796405 + i * 831760609) >>> 0);
    const u1 = rnd();
    const u2 = rnd();
    const u3 = rnd();
    const u4 = rnd();
    const golden = Math.PI * (3 - Math.sqrt(5));
    const angle = i * golden + u1 * Math.PI * 2;
    const radNorm = 0.24 + u2 * 0.34;
    let left = 50 + Math.cos(angle) * radNorm * 100;
    let top = 50 + Math.sin(angle) * radNorm * 92;
    if (Math.hypot(left - 50, top - 50) < 11) {
      left += (u3 - 0.5) * 34;
      top += (u4 - 0.5) * 34;
    }
    left = Math.min(90, Math.max(10, left));
    top = Math.min(88, Math.max(8, top));
    const sizeRpx = 80 + Math.floor(rnd() * 56);
    const animDelay = rnd() * 3.2;
    return {
      userId: p.userId,
      src: avatarOf(p),
      label: (p.nickName || "").trim() || `用户${p.userId}`,
      isYou: uid !== 0 && p.userId === uid,
      ready: p.readyStatus === 1,
      leftPct: left,
      topPct: top,
      sizeRpx,
      animDelay,
    };
  });
});

const houseTrackTitle = computed(() => {
  const id = houseSelectedTrackId.value || housePlayingId.value;
  const t = houseAudioTracks.value.find((x) => x.id === id);
  return t?.title || "选择音乐";
});

const primaryDeviceMac = computed(() => {
  const d = deviceListForHouse.value[0];
  return String(d?.mac ?? "").trim();
});

function resolveMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function avatarOf(p: ActivityRoomParticipant | undefined): string {
  if (!p?.avatarUrl) return PLACEHOLDER;
  const u = resolveMediaUrl(p.avatarUrl);
  return u || PLACEHOLDER;
}

const myUserId = computed(() => userStore.currentUser?.id ?? 0);

const titleDisplay = computed(() => {
  const t = room.value?.title?.trim();
  if (t) return t;
  const f = fallbackTitle.value?.trim();
  if (f) return f;
  return "活动标题";
});

const roomStatsLine = computed(() => {
  const r = room.value;
  if (!r) return "";
  return `已报名 ${r.participantCount} 人 · 已就绪 ${r.readyCount} 人 · ${phaseLabelZh.value}`;
});

const phaseLabelZh = computed(() => {
  const p = room.value?.phase ?? 0;
  if (p === 1) return "进行中";
  if (p === 2) return "已结算";
  return "待开场";
});

const scheduleSummary = computed(() => {
  const r = room.value;
  if (!r) return "";
  const a = r.startAt ? String(r.startAt).trim() : "";
  const b = r.endAt ? String(r.endAt).trim() : "";
  if (a && b) return `计划时间：${a} ~ ${b}`;
  if (a) return `计划开始：${a}`;
  if (b) return `计划结束：${b}`;
  return "";
});

const roomFlagsLine = computed(() => {
  const r = room.value;
  if (!r) return "";
  const parts: string[] = [];
  if (r.inScheduledWindow) parts.push("在计划窗内");
  if (r.rankGraceSeconds) parts.push(`榜宽限 ${r.rankGraceSeconds}s`);
  return parts.join(" · ");
});

const centerReady = computed(() => String(room.value?.readyCount ?? 0));
const centerCap = computed(() => {
  const r = room.value;
  if (!r) return "0";
  if (r.maxParticipants > 0) return String(r.maxParticipants);
  return String(Math.max(r.participantCount, 1));
});

const phaseSubtitle = computed(() => {
  const p = room.value?.phase;
  if (p === 1) return "共修进行";
  if (p === 2) return "已结束";
  return "入息等待";
});

const selfParticipant = computed(() => {
  const uid = myUserId.value;
  if (!uid) return undefined;
  return (room.value?.participants ?? []).find((x) => x.userId === uid);
});

const selfReady = computed(() => selfParticipant.value?.readyStatus === 1);

/** 待开场且本人已就绪：底部按钮高亮 */
const showReadyCtaStyle = computed(() => {
  const ph = room.value?.phase ?? 0;
  return ph === 0 && selfReady.value;
});

const isRoomOwner = computed(() => selfParticipant.value?.roomRole === 2);

/** 待开场且非房主：隐藏返回；房主或其它阶段：返回 + 首页 */
const navBarType = computed(() => {
  if (!userStore.isLoggedIn) return "all";
  const r = room.value;
  if (!r) return "all";
  if (r.phase === 0 && !isRoomOwner.value) return "no";
  return "all";
});

function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

const countdownText = computed(() => {
  const ph = room.value?.phase ?? 0;
  if (ph === 0) return formatCountdown(displayStartMs.value);
  if (ph === 1) return formatCountdown(displayEndMs.value);
  return "00:00";
});

/** 进行中且服务端建议开始，或已在计划窗内（缓解 suggest 字段相对轮询滞后） */
const showStartMeditationCta = computed(() => {
  const r = room.value;
  if (!r || r.phase !== 1) return false;
  return r.suggestStartMeditation === true || r.inScheduledWindow === true;
});

const ctaMainText = computed(() => {
  const ph = room.value?.phase ?? 0;
  const r = room.value;
  if (ph === 2) return "查看共修报告";
  if (ph === 1) {
    if (showStartMeditationCta.value) return "开始禅修";
    return `共修中 ${countdownText.value}`;
  }
  if (selfReady.value) return `已就绪 · ${countdownText.value}`;
  return `点按就绪 · ${countdownText.value}`;
});

async function refreshServerTime() {
  try {
    const res = await fetchActivityServerTime();
    parseServerTimeFromResponse(res);
  } catch (e) {
    console.error("fetchActivityServerTime", e);
  }
}

function applySuggestTips(s: ActivityRoomStateData) {
  if (s.suggestPrepareSoon && !tipsShown.has("prepare")) {
    tipsShown.add("prepare");
    uni.showToast({ title: "距离开场不足 5 分钟，请准备", icon: "none", duration: 2500 });
  }
  if (s.suggestStartMeditation && !tipsShown.has("start")) {
    tipsShown.add("start");
    uni.showToast({ title: "已到计划时段，可开始禅修", icon: "none", duration: 2500 });
  }
  if (s.suggestStopMeditation && !tipsShown.has("stop")) {
    tipsShown.add("stop");
    uni.showToast({ title: "本场临近结束，请适时收功", icon: "none", duration: 2500 });
  }
}

async function loadRoomState(opts?: { silent?: boolean }) {
  const silent = opts?.silent === true;
  roomError.value = "";
  if (!activityId.value) {
    room.value = null;
    roomLoading.value = false;
    roomError.value = "缺少活动 id";
    return;
  }
  if (!userStore.isLoggedIn) {
    room.value = null;
    roomLoading.value = false;
    return;
  }
  if (!silent) roomLoading.value = true;
  const fetchEpochAtStart = roomStateFetchEpoch;
  try {
    const res = await fetchActivityRoomState({ id: activityId.value });
    if (fetchEpochAtStart !== roomStateFetchEpoch) return;
    const data = parseRoomStateFromResponse(res);
    if (data) {
      room.value = data;
      displayStartMs.value = Math.max(0, Number(data.msUntilStart) || 0);
      displayEndMs.value = Math.max(0, Number(data.msUntilEnd) || 0);
      applySuggestTips(data);
    } else {
      room.value = null;
      roomError.value = "房间数据格式异常，请稍后重试";
      console.warn("parseRoomStateFromResponse: unexpected payload", res);
    }
  } catch (e) {
    if (fetchEpochAtStart !== roomStateFetchEpoch) return;
    console.error("fetchActivityRoomState", e);
    roomError.value = "房间状态加载失败";
  } finally {
    if (!silent) roomLoading.value = false;
  }
}

function retryLoadRoom() {
  void loadRoomState();
}

async function ensurePrimaryDeviceInUseFromApi(): Promise<boolean> {
  const mac = primaryDeviceMac.value;
  if (!mac) {
    uni.showToast({ title: "暂无已绑定的主设备", icon: "none" });
    return false;
  }
  try {
    const stRes = await fetchDeviceStatus({ mac });
    const st = unwrapApiData<DeviceStatusAppData>(stRes);
    const code = st && typeof st === "object" ? normalizeDeviceStatusCode(st.status) : -1;
    if (code !== 1) {
      const label = code >= 0 ? mapApiStatusToLabel(code) : "未知";
      uni.showToast({
        title: `设备未处于「使用中」，当前：${label}。请连接后重试或选无设备禅修`,
        icon: "none",
        duration: 3000,
      });
      return false;
    }
    return true;
  } catch (e) {
    console.error("ensurePrimaryDeviceInUseFromApi", e);
    uni.showToast({ title: "拉取设备状态失败，请稍后重试", icon: "none" });
    return false;
  }
}

async function ensureNoActiveMeditationBeforeStart(): Promise<boolean> {
  await meditationStore.fetchActiveSession();
  if (!meditationStore.hasActiveMeditationSession) return true;
  await new Promise<void>((resolve) => {
    uni.showModal({
      title: "提示",
      content: "当前有进行中的禅修，请先在静坐页继续或结束后再开始新的禅修。",
      showCancel: false,
      success: () => resolve(),
      fail: () => resolve(),
    });
  });
  return false;
}

/** 共修开始：按秒向下取整为分钟，夹在 1～300，保证「计划分钟 ×60」不超过服务端给出的剩余秒数 */
function clampGroupLaunchMinutesFromSeconds(sec: number): number {
  if (!Number.isFinite(sec) || sec < 60) return 0;
  const m = Math.floor(sec / 60);
  return Math.min(300, Math.max(1, m));
}

type GroupLaunchPlanResult =
  | { ok: true; seconds: number }
  | { ok: false; reason: "ended" | "too_short" | "no_plan" };

/**
 * 用 `roomState` 的 `msUntilEnd`（距计划结束剩余毫秒）限制计划禅修秒数，避免结算/报告超出活动结束。
 * `msUntilStart` 仍由 `loadRoomState` 写入倒计时，仅参与展示。
 */
function plannedSecondsFromRoomStateForLaunch(
  r: ActivityRoomStateData,
  baseSec: number,
): GroupLaunchPlanResult {
  const capSec = Math.max(0, Math.floor((r.msUntilEnd ?? 0) / 1000));
  if (r.phase === 1 && capSec <= 0) return { ok: false, reason: "ended" };

  let merged: number;
  if (capSec > 0) {
    merged = baseSec > 0 ? Math.min(baseSec, capSec) : capSec;
  } else {
    merged = Math.max(0, baseSec);
  }
  if (merged <= 0) return { ok: false, reason: "no_plan" };
  if (merged < 60) return { ok: false, reason: "too_short" };
  return { ok: true, seconds: merged };
}

/** 解析起止时间得到间隔秒数（无效则 0） */
function durationSecondsFromStartEnd(
  start: string | null | undefined,
  end: string | null | undefined,
): number {
  const a = start != null && String(start).trim() !== "" ? Date.parse(String(start)) : NaN;
  const b = end != null && String(end).trim() !== "" ? Date.parse(String(end)) : NaN;
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 0;
  return Math.floor((b - a) / 1000);
}

/**
 * 计划禅修秒数：优先 `targetMeditationSeconds`；为 0 或无效时用房间 `startAt`~`endAt`，再退回活动详情 `startDate`~`endDate`。
 */
function effectiveTargetMeditationSeconds(): number {
  const raw = targetMeditationSeconds.value;
  if (Number.isFinite(raw) && raw > 0) return Math.floor(raw);
  const r = room.value;
  const fromRoom = durationSecondsFromStartEnd(r?.startAt ?? null, r?.endAt ?? null);
  if (fromRoom > 0) return fromRoom;
  return durationSecondsFromStartEnd(activityDetailStart.value, activityDetailEnd.value);
}

async function maybeLoadActivityMeta() {
  if (templateId.value > 0 && targetMeditationSeconds.value > 0) return;
  if (!userStore.isLoggedIn || !activityId.value) return;
  try {
    const res = await fetchActivityDetail({ id: activityId.value });
    const d = unwrapApiData<ActivityDetail>(res);
    if (d && typeof d === "object") {
      if (!templateId.value) templateId.value = d.templateId;
      if (!targetMeditationSeconds.value) targetMeditationSeconds.value = d.targetMeditationSeconds ?? 0;
      if (d.title?.trim()) fallbackTitle.value = d.title.trim();
      activityDetailStart.value = d.startDate?.trim() ? String(d.startDate).trim() : null;
      activityDetailEnd.value = d.endDate?.trim() ? String(d.endDate).trim() : null;
    }
  } catch (e) {
    console.error("fetchActivityDetail", e);
  }
}

async function toggleReady() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: "请先登录", icon: "none" });
    return;
  }
  const ph = room.value?.phase ?? 0;
  if (ph !== 0) {
    uni.showToast({ title: "开场后不可再改就绪状态", icon: "none" });
    return;
  }
  if (readySubmitting.value) return;
  readySubmitting.value = true;
  try {
    const next = selfReady.value ? 0 : 1;
    await postActivityReady({ id: activityId.value, ready: next as 0 | 1 });
    await loadRoomState();
  } catch (e) {
    console.error("postActivityReady", e);
    uni.showToast({ title: "就绪状态更新失败", icon: "none" });
  } finally {
    readySubmitting.value = false;
  }
}

function openGroupReport() {
  if (!activityId.value) return;
  uni.navigateTo({
    url: `/pages/community/activity-group-report?id=${activityId.value}`,
  });
}

async function openStartMeditationFlow() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: "请先登录", icon: "none" });
    return;
  }
  if (!showStartMeditationCta.value) {
    uni.showToast({ title: "当前时段暂不建议开始", icon: "none" });
    return;
  }
  uni.showLoading({ title: "同步设备状态…", mask: true });
  try {
    await deviceStore.refreshListAndSyncFirstDeviceDetail();
  } finally {
    uni.hideLoading();
  }
  showMeditationDevicePopup.value = true;
}

async function confirmStartMeditationWithDevice(hasDevice: boolean) {
  if (!userStore.isLoggedIn) {
    showMeditationDevicePopup.value = false;
    return;
  }
  const can = await ensureNoActiveMeditationBeforeStart();
  if (!can) {
    showMeditationDevicePopup.value = false;
    return;
  }
  if (hasDevice) {
    uni.showLoading({ title: "确认设备状态…", mask: true });
    try {
      await deviceStore.refreshListAndSyncFirstDeviceDetail();
      const ok = await ensurePrimaryDeviceInUseFromApi();
      if (!ok) {
        nextTick(() => {
          showMeditationDevicePopup.value = true;
        });
        return;
      }
    } finally {
      uni.hideLoading();
    }
  }

  // uni.showLoading({ title: "活动打卡中…", mask: true });
  // try {
  //   await postActivityCheckin({ id: activityId.value });
  // } catch (e) {
  //   console.error("postActivityCheckin", e);
  //   uni.showToast({ title: "活动打卡失败，请稍后重试", icon: "none" });
  //   return;
  // } finally {
  //   uni.hideLoading();
  // }

  await maybeLoadActivityMeta();
  if (!templateId.value) {
    uni.showToast({ title: "缺少活动模板信息，请返回重试", icon: "none" });
    return;
  }

  await loadRoomState({ silent: true });
  const r = room.value;
  if (!r) {
    uni.showToast({ title: roomError.value || "无法获取房间状态，请稍后重试", icon: "none" });
    return;
  }
  if (r.phase !== 1) {
    uni.showToast({ title: "房间状态已变更，请返回或刷新后再试", icon: "none" });
    return;
  }
  const baseSec = effectiveTargetMeditationSeconds();
  const plan = plannedSecondsFromRoomStateForLaunch(r, baseSec);
  if (!plan.ok) {
    if (plan.reason === "ended") {
      uni.showToast({ title: "本场已到计划结束时间", icon: "none" });
      return;
    }
    if (plan.reason === "too_short") {
      uni.showToast({ title: "距计划结束不足 1 分钟，无法开始", icon: "none" });
      return;
    }
    uni.showToast({ title: "无法推算本场禅修时长，请返回重试", icon: "none" });
    return;
  }
  const planned = clampGroupLaunchMinutesFromSeconds(plan.seconds);
  if (!planned) {
    uni.showToast({ title: "推算出的禅修时长无效，请稍后重试", icon: "none" });
    return;
  }
  /** 与首页一致：当前房音乐（选中/播放/首条）→ 否则沿用用户在首页上次选的曲目，避免写空串把 store 音乐清掉 */
  const row = resolveHouseCurrentTrack();
  const trackId =
    (row?.id && String(row.id)) || meditationStore.lastMeditationTrackId || "";
  const trackTitle =
    row?.title?.trim() ||
    meditationStore.lastMeditationTrackTitle?.trim() ||
    room.value?.title?.trim() ||
    "共修禅修";
  const trackUrl =
    (row?.url && String(row.url)) || meditationStore.lastMeditationTrackUrl || "";
  const payload: NextMeditationLaunchPayload = {
    durationMinutes: planned,
    trackId,
    trackTitle,
    trackUrl,
    useHardwareDevice: hasDevice,
    activityId: activityId.value,
    activityTemplateId: templateId.value,
    postReport: "group",
  };
  meditationStore.applyNextMeditationLaunch(payload);
  showMeditationDevicePopup.value = false;
  uni.navigateTo({
    url: "/pages/meditation/startMeditaiton",
  });
}

function ensureHouseInnerAudio() {
  if (houseInnerAudio) return houseInnerAudio;
  houseInnerAudio = uni.createInnerAudioContext();
  houseInnerAudio.obeyMuteSwitch = false;
  houseInnerAudio.onEnded(() => {
    housePlayingId.value = null;
  });
  houseInnerAudio.onError((err) => {
    console.error("activity-house audio", err);
    housePlayingId.value = null;
    uni.showToast({ title: "音频无法播放，请检查网络", icon: "none" });
  });
  return houseInnerAudio;
}

// #ifdef MP-WEIXIN
function ensureHouseBgAudioWx() {
  if (houseBgAudio) return houseBgAudio;
  const bg = uni.getBackgroundAudioManager();
  houseBgAudio = bg;
  houseBgEndedHandler = () => {
    housePlayingId.value = null;
  };
  houseBgErrorHandler = (err: unknown) => {
    console.error("activity-house bg audio", err);
    housePlayingId.value = null;
    uni.showToast({ title: "音频无法播放，请检查网络", icon: "none" });
  };
  bg.onEnded(houseBgEndedHandler);
  bg.onError(houseBgErrorHandler);
  return bg;
}
// #endif

function stopHouseMusic() {
  // #ifdef MP-WEIXIN
  if (houseBgAudio) {
    try {
      houseBgAudio.stop();
    } catch {
      /* noop */
    }
  }
  // #endif
  if (!houseInnerAudio) return;
  try {
    houseInnerAudio.stop();
  } catch {
    /* noop */
  }
}

function disposeHouseMusicAudio() {
  stopHouseMusic();
  // #ifdef MP-WEIXIN
  if (houseBgAudio) {
    const bg = houseBgAudio as UniApp.BackgroundAudioManager & {
      offEnded?: (h: () => void) => void;
      offError?: (h: (e: unknown) => void) => void;
    };
    try {
      if (houseBgEndedHandler && typeof bg.offEnded === "function") {
        bg.offEnded(houseBgEndedHandler);
      }
    } catch {
      /* noop */
    }
    try {
      if (houseBgErrorHandler && typeof bg.offError === "function") {
        bg.offError(houseBgErrorHandler);
      }
    } catch {
      /* noop */
    }
  }
  houseBgAudio = null;
  houseBgEndedHandler = null;
  houseBgErrorHandler = null;
  // #endif
  if (houseInnerAudio) {
    try {
      houseInnerAudio.destroy();
    } catch {
      /* noop */
    }
    houseInnerAudio = null;
  }
  housePlayingId.value = null;
}

async function fetchHouseMusicFirstPage() {
  if (!userStore.isLoggedIn) {
    houseMusicHint.value = "登录后可加载疗愈音乐";
    return;
  }
  houseMusicLoading.value = true;
  houseMusicHint.value = "";
  try {
    const res = await getMusicPage({ page: 1, size: HOUSE_MUSIC_PAGE_SIZE });
    const data = unwrapApiData<MusicPageData>(res);
    if (!data || !Array.isArray(data.list)) {
      throw new Error("music: invalid payload");
    }
    const mapped = data.list.map((item, i) => mapMusicListItemToRow(item, i, HOUSE_COVER_CLASS_CYCLE));
    houseAudioTracks.value = mapped;
    if (!houseSelectedTrackId.value && mapped[0]) {
      houseSelectedTrackId.value = mapped[0].id;
    }
    houseMusicHint.value = mapped.length ? "" : "暂无音乐";
  } catch (e) {
    console.error("fetchHouseMusicFirstPage", e);
    houseMusicHint.value = "音乐列表加载失败";
    uni.showToast({ title: "音乐列表加载失败", icon: "none" });
  } finally {
    houseMusicLoading.value = false;
  }
}

function resolveHouseCurrentTrack(): MusicTrackRow | null {
  const list = houseAudioTracks.value;
  if (!list.length) return null;
  const sid = houseSelectedTrackId.value || housePlayingId.value;
  if (sid) {
    const hit = list.find((t) => t.id === sid);
    if (hit) return hit;
  }
  return list[0] ?? null;
}

function toggleHouseMusicPlay() {
  const track = resolveHouseCurrentTrack();
  if (!track || !track.url) {
    uni.showToast({ title: "暂无可用音频", icon: "none" });
    return;
  }
  const t = track;
  houseSelectedTrackId.value = t.id;

  // #ifdef MP-WEIXIN
  const bg = ensureHouseBgAudioWx();
  if (housePlayingId.value === t.id) {
    try {
      bg.pause();
    } catch {
      /* noop */
    }
    housePlayingId.value = null;
    return;
  }
  stopHouseMusic();
  bg.title = t.title || "疗愈音乐";
  bg.epname = "共修等待室";
  bg.singer = "静心";
  bg.coverImgUrl = t.coverUrl || "/static/logo.png";
  bg.src = t.url;
  housePlayingId.value = t.id;
  try {
    bg.play();
  } catch {
    /* noop */
  }
  return;
  // #endif

  const ctx = ensureHouseInnerAudio();
  if (housePlayingId.value === t.id) {
    ctx.pause();
    housePlayingId.value = null;
    return;
  }
  stopHouseMusic();
  ctx.src = t.url;
  housePlayingId.value = t.id;
  ctx.play();
}

function shiftHouseTrack(delta: number) {
  const list = houseAudioTracks.value;
  if (!list.length) return;
  const cur = resolveHouseCurrentTrack();
  const idx = Math.max(0, list.findIndex((t) => t.id === (cur?.id ?? "")));
  const n = list.length;
  const next = list[(idx + delta + n * 10) % n];
  if (next) {
    houseSelectedTrackId.value = next.id;
    if (housePlayingId.value) {
      stopHouseMusic();
      housePlayingId.value = null;
      toggleHouseMusicPlay();
    }
  }
}

function onPrevHouseTrack() {
  shiftHouseTrack(-1);
}

function onNextHouseTrack() {
  shiftHouseTrack(1);
}

function onCtaTap() {
  const ph = room.value?.phase ?? 0;
  if (ph === 2) {
    openGroupReport();
    return;
  }
  if (ph === 1) {
    void openStartMeditationFlow();
    return;
  }
  void toggleReady();
}

function startTimers() {
  stopTimers();
  pollTimer = setInterval(() => {
    void loadRoomState();
  }, 15000);
  tickTimer = setInterval(() => {
    if (displayStartMs.value > 0) {
      const before = displayStartMs.value;
      displayStartMs.value = Math.max(0, before - 1000);
      if (before > 0 && displayStartMs.value === 0 && (room.value?.phase ?? 0) === 0) {
        void loadRoomState();
      }
    }
    if (displayEndMs.value > 0) displayEndMs.value = Math.max(0, displayEndMs.value - 1000);
  }, 1000);
}

function stopTimers() {
  if (pollTimer != null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (tickTimer != null) {
    clearInterval(tickTimer);
    tickTimer = null;
  }
}

/** 离开页：停轮询/倒计时，使飞行中的 roomState 回调不再改 UI */
function disposeActivityHousePage() {
  stopTimers();
  roomStateFetchEpoch++;
  disposeHouseMusicAudio();
}

onShow(() => {
  void loadRoomState();
  void maybeLoadActivityMeta();
});

onLoad(async (q) => {
  const rawId = q?.id;
  const n = typeof rawId === "string" || typeof rawId === "number" ? Number(rawId) : NaN;
  activityId.value = Number.isFinite(n) ? n : 0;

  const rawTid = q?.templateId;
  const tid = typeof rawTid === "string" || typeof rawTid === "number" ? Number(rawTid) : NaN;
  templateId.value = Number.isFinite(tid) ? tid : 0;

  const rawSec = q?.targetSec;
  const sec = typeof rawSec === "string" || typeof rawSec === "number" ? Number(rawSec) : NaN;
  targetMeditationSeconds.value = Number.isFinite(sec) ? sec : 0;

  await refreshServerTime();
  await maybeLoadActivityMeta();
  await loadRoomState();
  startTimers();
  void fetchHouseMusicFirstPage();
});

onUnload(() => {
  disposeActivityHousePage();
});

onBeforeUnmount(() => {
  disposeActivityHousePage();
});

const onBack = () => navigateBack();
</script>

<style scoped lang="scss">
/* ─── Center orb ─────────────────────────────────────── */
.center-orb {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 260rpx;
  height: 260rpx;
  border-radius: 9999px;
  background: rgba(212, 175, 53, 0.08);
  border: 2rpx solid rgba(212, 175, 53, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 80rpx rgba(212, 175, 53, 0.15), inset 0 0 40rpx rgba(212, 175, 53, 0.06);
}

/* ─── Ripple rings ───────────────────────────────────── */
.ripple-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  border: 1rpx solid rgba(212, 175, 53, 0.2);
  animation: ripple 3s ease-out infinite;
}
.ripple-1 {
  width: 300rpx;
  height: 300rpx;
  animation-delay: 0s;
}
.ripple-2 {
  width: 440rpx;
  height: 440rpx;
  animation-delay: 0.8s;
}
.ripple-3 {
  width: 580rpx;
  height: 580rpx;
  animation-delay: 1.6s;
}

@keyframes ripple {
  0% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(0.95);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

/* ─── 头像散布层 ─────────────────────────────────────── */
.scatter-stage {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.scatter-avatar {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.scatter-float-1 {
  animation: scatterFloat1 4.2s ease-in-out infinite;
}
.scatter-float-2 {
  animation: scatterFloat2 5.1s ease-in-out infinite;
}
.scatter-float-3 {
  animation: scatterFloat3 5.6s ease-in-out infinite;
}
.scatter-float-4 {
  animation: scatterFloat4 4.8s ease-in-out infinite;
}

@keyframes scatterFloat1 {
  0%,
  100% {
    transform: translate(-50%, -50%) translate(0, 0);
  }
  50% {
    transform: translate(-50%, -50%) translate(-6rpx, -12rpx);
  }
}
@keyframes scatterFloat2 {
  0%,
  100% {
    transform: translate(-50%, -50%) translate(0, 0);
  }
  50% {
    transform: translate(-50%, -50%) translate(8rpx, -10rpx);
  }
}
@keyframes scatterFloat3 {
  0%,
  100% {
    transform: translate(-50%, -50%) translate(0, 0);
  }
  50% {
    transform: translate(-50%, -50%) translate(6rpx, 10rpx);
  }
}
@keyframes scatterFloat4 {
  0%,
  100% {
    transform: translate(-50%, -50%) translate(0, 0);
  }
  50% {
    transform: translate(-50%, -50%) translate(-8rpx, 8rpx);
  }
}

/* ─── Avatar wrappers ────────────────────────────────── */
.seat-avatar-wrap {
  border-radius: 9999px;
  border-width: 3rpx;
  border-style: solid;
  padding: 3rpx;
  overflow: hidden;
  background: rgba(248, 247, 246, 0.9);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.border-theme-1 {
  border-color: #d4af35;
}
.border-theme-color-2 {
  border-color: #dabb53;
}
.border-theme-color-3 {
  border-color: #f0e8cf;
}

.shadow-gold {
  box-shadow: 0 0 40rpx rgba(212, 175, 53, 0.35), 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

/* ─── YOU badge ──────────────────────────────────────── */
.you-badge {
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #d4af35;
  border-radius: 9999px;
  padding: 3rpx 15rpx;
}

/* ─── Decor elements ─────────────────────────────────── */
.decor-line {
  background: linear-gradient(to bottom, rgba(212, 175, 53, 0.3), transparent);
}
.decor-circle {
  border: 1rpx solid rgba(212, 175, 53, 0.08);
}

/* ─── Bottom control panel ───────────────────────────── */
.control-panel {
  background: rgba(248, 247, 246, 0.85);
  border: 1rpx solid rgba(212, 175, 53, 0.25);
  border-radius: 48rpx;
  padding: 40rpx 44rpx;
  box-shadow: 0 32rpx 80rpx rgba(112, 89, 0, 0.12);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* ─── Eq icon wrap ───────────────────────────────────── */
.eq-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  background: rgba(212, 175, 53, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Playback controls ──────────────────────────────── */
.ctrl-btn-sm {
  width: 64rpx;
  height: 64rpx;
  border-radius: 9999px;
  background: rgba(212, 175, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ctrl-btn-play {
  width: 80rpx;
  height: 80rpx;
  border-radius: 9999px;
  background: #d4af35;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(212, 175, 53, 0.4);
}

/* ─── CTA button ─────────────────────────────────────── */
.cta-btn {
  width: 100%;
  border-radius: 9999px;
  background: rgba(212, 175, 53, 0.08);
  border: 1rpx solid rgba(212, 175, 53, 0.3);
  padding: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition:
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
  &:active {
    background: rgba(212, 175, 53, 0.18);
  }
}

.cta-btn--ready {
  background: linear-gradient(
    135deg,
    rgba(212, 175, 53, 0.38) 0%,
    rgba(176, 143, 28, 0.28) 50%,
    rgba(212, 175, 53, 0.32) 100%
  );
  border-color: rgba(212, 175, 53, 0.72);
  box-shadow:
    0 10rpx 36rpx rgba(212, 175, 53, 0.28),
    inset 0 1rpx 0 rgba(255, 255, 255, 0.35);
  &:active {
    background: linear-gradient(
      135deg,
      rgba(212, 175, 53, 0.48) 0%,
      rgba(176, 143, 28, 0.36) 100%
    );
  }
}

/* ─── FAB ────────────────────────────────────────────── */
.fab {
  position: fixed;
  bottom: calc(96rpx + 200rpx);
  right: 40rpx;
  z-index: 50;
  width: 112rpx;
  height: 112rpx;
  border-radius: 9999px;
  background: #d4af35;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 40rpx rgba(212, 175, 53, 0.45);
  &:active {
    transform: scale(0.92);
  }
}
</style>
