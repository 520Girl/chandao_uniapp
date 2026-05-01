<template>
  <view class="flex flex-col min-h-screen pb-6 theme-bg meditation-page">
    <HomeBar title="静坐" description="一 念 静 心" :leftIcon="'icon-bell'" :messageCount="messageUnreadCount"
      titleIcon="icon-Cloudy" :handleClick="goProfile" />

    <view class="flex-1 px-6 flex items-center">
      <view class="flex-1 flex flex-col items-center relative overflow-y-auto no-scrollbar pt-4">
        <!-- Interactive Time Selection -->
        <view class="w-full flex flex-col items-center justify-center relative">
          <view
            class="glow-blob absolute top-1/2 left-1/2 w-full aspect-square bg-primary/5 blur-[100px] rounded-full -z-10" />

          <view
            class="ring-touch-area relative w-full max-w-[320px] aspect-square flex items-center justify-center float-ring">
            <view
              class="absolute inset-0 rounded-full border border-gray-200 dark:border-primary/10 ring-border-pulse" />

            <!-- 仅环形区域接收拖拽：z-index 低于中间控制区，避免拦截 +/- 的 tap -->
            <view class="ring-hit-layer absolute inset-0 z-[5] rounded-full" @touchstart.stop="onRingTouch"
              @touchmove.stop.prevent="onRingTouch" @touchend.stop="onRingTouch" @touchcancel.stop="onRingTouch" />

            <!-- 进度环：border 底轨 + conic-gradient 进度（替代 SVG，小程序兼容性更好） -->
            <view class="absolute inset-0 z-10 rounded-full pointer-events-none ring-progress-stack">
              <view class="absolute inset-0 rounded-full ring-track-border" />
              <view class="absolute inset-0 rounded-full ring-progress-conic" :style="ringConicStyle" />
              <view class="absolute rounded-full ring-progress-hole" />
            </view>

            <!-- 环形拖块：臂长 45% 与环半径比例一致 -->
            <view class="absolute left-1/2 bottom-1/2 z-20 flex justify-center pointer-events-none"
              style="width: 0; height: 45%; transform-origin: 50% 100%"
              :style="{ transform: `translateX(-50%) rotate(${handleRotateDeg}deg)` }">
              <view
                class="absolute top-[-25rpx] left-1/2 size-5 -ml-2.5 -mt-2.5 rounded-full bg-white dark:bg-background-dark border-2 border-primary shadow-lg handle-dot" />
            </view>

            <!-- z-30 盖在 ring-hit 之上，保证 +/- 与数字区域可点 -->
            <view class="text-center z-30 flex flex-col items-center relative px-2 py-1">
              <view class="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2 label-shimmer">设定时长</view>
              <view class="flex items-center gap-3 my-2">
                <view
                  class="size-10 rounded-full bg-white dark:bg-white/5 border border-primary/10 flex items-center justify-center shadow-sm btn-press"
                  hover-class="btn-press-active" role="button" @click.stop="adjustMinutes(-stepMinutes)">
                  <text class="iconfont icon-Remove-1 theme-color-1 font-bold text-[35rpx]" />
                </view>
                <view class="flex flex-col items-center">
                  <view class="text-7xl font-light text-gray-900 dark:text-white tracking-tighter tabular-nums">
                    {{ timeDisplay }}
                  </view>
                  <view class="text-xs text-gray-400 font-medium">分钟</view>
                </view>
                <view
                  class="size-10 rounded-full bg-white dark:bg-white/5 border border-primary/10 flex items-center justify-center shadow-sm btn-press"
                  hover-class="btn-press-active" role="button" @click.stop="adjustMinutes(stepMinutes)">
                  <text class="iconfont icon-add theme-color-1 text-[30rpx]" />
                </view>

              </view>
              <view
                v-if="userStore.isLoggedIn && primaryDeviceMac"
                class="w-full mt-1 px-1"
              >
                <view class="w-full flex flex-col items-center justify-center">
                  <view
                    class="inline-flex max-w-full flex-row flex-nowrap items-center justify-center gap-2 text-center"
                  >
                    <text
                      v-if="homeStatusBarIcon === 'offline'"
                      class="iconfont icon-lixian text-[40rpx] text-gray-500 shrink-0"
                      aria-hidden="true"
                    />
                    <text
                      v-else-if="homeStatusBarIcon === 'ready'"
                      class="iconfont icon-rengongfuwuyijiuxu text-[40rpx] text-[green] shrink-0"
                      aria-hidden="true"
                    />
                    <view
                      v-else
                      class="shrink-0 p-1 rounded-full active:opacity-80 flex items-center justify-center"
                      :class="deviceSnapshotLoading ? 'opacity-90 pointer-events-none' : ''"
                      @click.stop="loadHomeDeviceStatusAndRealtime"
                    >
                      <text
                        class="iconfont icon-saomiaoshebeishuaxin text-[40rpx] text-[#f58f17] block leading-none"
                        :class="{ 'device-refresh-scan-icon--spinning': deviceSnapshotLoading }"
                      />
                    </view>
                    <text
                      class="text-[28rpx] font-normal leading-tight text-center max-w-[220px] shrink-0"
                      :class="homeDeviceIsOffline ? 'text-gray-500' : 'text-primary'"
                    >{{ homeRingTitle }}</text>
                  </view>
                </view>
                <!-- <view v-if="homeStatusSubline" class="text-[20rpx] text-gray-400 mt-1 break-words">{{ homeStatusSubline }}</view> -->
                <view v-if="!homeDeviceIsOffline" class="w-full max-w-[280px] mx-auto mt-[20rpx]">
                  <view v-if="homeRealtimeErrorText" class="text-[22rpx] text-amber-600/90 text-center">
                    {{ homeRealtimeErrorText }}
                  </view>
                  <view v-else-if="homeHrSlots.length" class="flex items-stretch gap-2"
                    :class="homeHrSlots.length > 1 ? 'justify-between' : 'justify-center'">
                    <view v-for="(slot, idx) in homeHrSlots" :key="idx"
                      class="flex items-center justify-between w-[60%] gap-1"
                      :class="homeHrSlots.length > 1 ? 'flex-1 min-w-0' : ''">
                      <view class="flex flex-col items-center justify-center">
                        <view class="text-[34rpx] font-normal tabular-nums theme-color-1">
                        {{ slot.heartRate }}
                        </view>
                        <view class="text-[18rpx] theme-color-8">心率 </view>
                        <!-- <view class="text-[18rpx] theme-color-8">心率 · {{ slot.side }}侧</view> -->
                      </view>
                      
                      <view class="flex flex-col items-center justify-center">
                        <view
                        class="text-[34rpx] font-normal tabular-nums theme-color-1 mt-1"
                      >{{ slot.respirationRate }}</view>
                      <view class="text-[18rpx] theme-color-8">呼吸率</view> 
                      <!-- <view class="text-[18rpx] theme-color-8">呼吸率 · {{ slot.side }}侧</view> -->
                      </view>
                    </view>
                  </view>
                  <view v-else class="text-[20rpx] text-gray-400 text-center">
                    {{ deviceSnapshotLoading ? "同步中…" : "等待实时心率/呼吸率…" }}
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 仅保留自定义滑轨（与圆环共用 durationMinutes，避免 u-slider 与 v-model 互相覆盖） -->
          <view class="w-full max-w-xs mt-12 px-4">
            <view class="text-center text-[26rpx] font-medium theme-color-1 mb-3 tabular-nums">{{ durationMinutes }} 分钟
            </view>
            <view class="duration-track relative h-2 rounded-full bg-gray-200 dark:bg-primary/20"
              @touchstart.stop.prevent="onBarTouch" @touchmove.stop.prevent="onBarTouch" @touchend.stop="onBarTouch"
              @touchcancel.stop="onBarTouch">
              <view
                :class="['absolute left-0 top-0 h-full rounded-full bg-primary', barDragging ? '' : 'track-fill-anim']"
                :style="{ width: barPercent + '%' }" />
              <view
                class="absolute top-1/2 size-4 rounded-full bg-white border-2 border-primary shadow-md thumb-pulse thumb-center"
                :style="{ left: barPercent + '%' }" />
            </view>
            <view class="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
              <view>{{ minLabel }}</view>
              <view>{{ maxLabel }}</view>
            </view>
          </view>
        </view>

        <!-- 疗愈音频 -->
        <view class="w-full mt-4 audio-card-anim">
          <view
            class="bg-white/90 dark:bg-primary/5 rounded-2xl border border-primary/5 backdrop-blur-sm overflow-hidden">
            <view class="flex items-center justify-between p-4" @click="audioExpanded = !audioExpanded">
              <view class="flex items-center gap-2">
                <view class="iconfont icon-musicnote theme-color-1 text-[40rpx] music-icon-bob" />
                <view class="text-sm font-semibold tracking-wide uppercase opacity-70">疗愈音乐</view>
              </view>
              <view class="flex items-center gap-2">
                <view class="text-[10px] font-bold theme-color-1 truncate max-w-[180rpx]">
                  {{ currentTrackTitle }}
                </view>
                <view class="iconfont icon-jinru theme-color-1 text-[20rpx] transition-transform duration-300"
                  :class="audioExpanded ? 'rotate-180' : ''" />
              </view>
            </view>
            <view v-show="audioExpanded" class="px-4 pb-4">
              <up-list class="music-up-list" height="420rpx" :lower-threshold="100" :show-scrollbar="false"
                @scrolltolower="onMusicScrollToLower">
                <up-list-item v-for="item in audioTracks" :key="item.id" :anchor="String(item.id)">
                  <view class="flex items-center gap-3 p-2 rounded-xl border transition-colors mb-2" :class="playingId === item.id
                    ? 'bg-primary/5 border-primary/10'
                    : 'border-transparent active:bg-white/40 dark:active:bg-white/5'
                    " @click="togglePlay(item)">
                    <view class="size-10 rounded-lg flex items-center justify-center shrink-0" :class="item.coverClass"
                      :style="{ backgroundImage: `url(${item.coverUrl})` }">
                      <text :class="playingId === item.id ? 'iconfont icon-pause' : 'iconfont icon-round-play_arrow-p'"
                        class="theme-color-1 text-[30rpx]" />
                    </view>
                    <view class="flex-1 min-w-0">
                      <view class="text-xs font-bold truncate">{{ item.title }}</view>
                      <view class="text-[10px] text-gray-500">{{ item.subtitle }}</view>
                    </view>
                    <view v-if="playingId === item.id"
                      class="size-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                  </view>
                </up-list-item>
                <up-loadmore :status="musicLoadStatus" line @loadmore="loadMoreMusic" />
              </up-list>
              <view v-if="!musicFetching && audioTracks.length === 0" class="text-center py-6 text-xs text-gray-400">
                暂无音乐
              </view>
              <view class="block text-center pt-2 text-[10px] font-bold text-primary/60">长按卡片可试听（点击播放/暂停）</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="space-y-6 mt-8">
      <view class="text-[28rpx] px-6 font-bold uppercase tracking-widest theme-color-8 px-2">共修活动</view>
      <scroll-view scroll-x class="w-full whitespace-nowrap" :show-scrollbar="false" enable-flex
        :scroll-into-view="activityScrollIntoView" scroll-with-animation>
        <view class="inline-flex flex-row gap-6 pb-10 pt-2 pl-2 pr-2 snap-x">
          <view v-for="item in homeActivityCards" :key="item.id" :id="'hm-act-' + item.id"
            class="relative flex-shrink-0 w-[70vw] h-64 cloud-card shadow-2xl shadow-indigo-900/10 snap-center overflow-hidden">
            <view :class="item.bgClass" class="absolute inset-0 bg-gradient-to-tr to-transparent z-0" />
            <view v-if="item.imgUrl" class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay z-[1]"
              :style="{ backgroundImage: `url('${item.imgUrl}')` }" />
            <view class="absolute inset-0 p-8 flex flex-col justify-end z-10"
              :class="item.sceneType === 'dark' ? 'text-white' : ''">
              <view class="mb-3">
                <text :class="item.btnClass"
                  class="px-3 py-1 rounded-full text-[20rpx] font-medium tracking-widest border border-white/20">
                  {{ item.endTime }}
                </text>
              </view>
              <view :class="item.h2Class" class="text-2xl font-medium mb-3 tracking-tight break-words">{{ item.title }}
              </view>
              <view :class="item.spanClass" class="text-xs leading-relaxed font-light mb-6 line-clamp-3">{{
                item.subtitle
              }}</view>
              <view class="flex items-center justify-between">
                <view hover-class="opacity-90"
                  class="px-[48rpx] py-[20rpx] bg-theme-1 text-white rounded-full text-[20rpx] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 backdrop-blur-sm"
                  @click.stop="startMeditationFromActivity(item)">
                  即刻参与
                </view>
                <view>
                  <view :class="item.sceneType === 'dark' ? 'text-white/40' : 'text-[#918355]/60'"
                    class="text-[20rpx] tracking-widest">
                    达标：{{ item.passPercent }}%
                  </view>
                  <view :class="item.sceneType === 'dark' ? 'text-white/40' : 'text-[#918355]/60'"
                    class="text-[20rpx] tracking-widest">
                    总时长：{{ item.totalTime }}
                  </view>
                </view>

              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view v-if="activitiesLoading" class="text-center text-xs theme-color-8 -mt-6 pb-2">活动加载中…</view>
      <view class="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 py-3 px-2 text-[22rpx] theme-color-8">
        <text class="text-primary/90 active:opacity-80" @click="openUserAgreementFromHome">用户协议</text>
        <text class="opacity-30">|</text>
        <text class="text-primary/90 active:opacity-80" @click="openPrivacyFromHome">隐私政策</text>
      </view>
    </view>
    <!-- //开始按钮 -->
    <view class="fixed bottom-24 right-6 flex flex-col gap-3">
      <button @click="onStartMeditation()"
        class="flex items-center justify-center w-[112rpx] h-[112rpx] rounded-full  bg-theme-2 text-background-dark shadow-lg shadow-primary/20 active:scale-95 transition-transform">
        <text class="iconfont icon-lianhua-yellow text-[50rpx] text-white"></text>
      </button>
    </view>

    <ConfirmDialog v-model:show="showMeditationDevicePopup" title="选择禅修方式" :message="meditationDeviceDialogMessage"
      cancel-text="无设备" confirm-text="有设备" :mask-closable="true" :show-close="true"
      @cancel="confirmStartMeditationWithDevice(false)" @confirm="confirmStartMeditationWithDevice(true)"
      @dismiss="onMeditationDeviceDialogDismiss" />
  </view>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { fetchActivityPage, postActivityCheckin } from '@/assets/js/api/activity';
import { fetchDeviceStatus, postDeviceRealtime } from '@/assets/js/api/device';
import { fetchMessageUnreadCount } from '@/assets/js/api/message';
import { getMusicPage } from '@/assets/js/api/user';
import { config } from '@/assets/js/config';
import ConfirmDialog from '@/components/common/confirmDialog.vue';
import HomeBar from '@/components/homeBar.vue';
import { useDeviceStore } from '@/stores/device';
import { useMeditationStore, type NextMeditationLaunchPayload } from '@/stores/meditation';
import { useUserStore } from '@/stores/user';
import type {
  ActivityCheckinDTO,
  ActivityPage,
  ActivityPageListItem,
  HomeActivityCard,
  SceneType,
} from '@/types/api/activity';
import type { DeviceRealtimePayload, DeviceStatusAppData } from '@/types/api/device';
import type { MusicPageData } from '@/types/api/music';
import { unwrapApiData } from '@/utils/apiResponse';
import { formatDate } from '@/utils/common';
import { mapApiStatusToLabel, normalizeDeviceStatusCode } from '@/utils/deviceMap';
import { mapMusicListItemToRow, resolveMusicAssetUrl } from '@/utils/musicPage';
import { reLaunchAgreementFromHome } from '@/utils/agreementNavigation';
import { getCurrentLatLng } from '@/utils/location';

/** 5 分钟为 1 档；5–300 分（5 小时） */
const minMinutes = 5;
const maxMinutes = 300;
const stepMinutes = 5;

/** 默认取区间中间偏下，避免为 min 时进度条/圆环为 0 看起来像「无填充」 */
const durationMinutes = ref(5);
const audioExpanded = ref(false);

const barDragging = ref(false);

/** 右下角开始禅修：先选有/无设备 */
const showMeditationDevicePopup = ref(false);
/** 非 null 表示弹窗由场景卡触发，确认后需带上 `activityId` / `activityTemplateId` */
const pendingActivityLaunch = ref<HomeActivityCard | null>(null);

const ringProgress = computed(() => {
  const span = maxMinutes - minMinutes;
  if (span <= 0) return 0;
  const cur = Number(durationMinutes.value);
  const base = Number.isNaN(cur) ? minMinutes : cur;
  return Math.min(1, Math.max(0, (base - minMinutes) / span));
});

/** 首页铃铛未读角标（GET `/app/message/unread-count` 的 data） */
const messageUnreadCount = ref(0);

/**
 * 拉取未读消息数。首页为 tabBar 页，应在 `onShow` 调用，从消息页返回时会自动刷新。
 */
async function loadMessageUnreadCount() {
  try {
    const res = await fetchMessageUnreadCount();
    const inner = unwrapApiData<Record<string, unknown> | number>(res);
    let n = 0;
    if (typeof inner === 'number') {
      n = inner;
    } else if (inner && typeof inner === 'object' && typeof inner.data === 'number') {
      n = inner.data;
    }
    messageUnreadCount.value = Math.max(0, Math.floor(n));
  } catch (e) {
    console.error('fetchMessageUnreadCount', e);
  }
}

// 跳转消息中心
const goProfile = () => {
  uni.navigateTo({
    url: '/pages/message/index'
  });
};

function openUserAgreementFromHome() {
  reLaunchAgreementFromHome("user");
}

function openPrivacyFromHome() {
  reLaunchAgreementFromHome("privacy");
}

const userStore = useUserStore();
const meditationStore = useMeditationStore();
const deviceStore = useDeviceStore();
const { devices: deviceListForHome } = storeToRefs(deviceStore);

const DEVICE_HOME_POLL_MS = 5000;
let homeDevicePollTimer: ReturnType<typeof setInterval> | null = null;

const homeDeviceStatus = ref<DeviceStatusAppData | null>(null);
const homeDeviceRealtime = ref<DeviceRealtimePayload | null>(null);
const deviceSnapshotLoading = ref(false);

const primaryDeviceMac = computed(() => {
  const d = deviceListForHome.value[0];
  return String(d?.mac ?? "").trim();
});

const homeStatusUpdateTime = computed(() => {
  const t = homeDeviceStatus.value?.statusUpdateTime;
  return t && String(t).trim() !== "" ? String(t) : "";
});

/** 状态码 4 为离线；interface.id 同步为云端状态码时一并判断 */
const homeDeviceIsOffline = computed((): boolean => {
  const s = homeDeviceStatus.value;
  if (!s) return false;
  if (normalizeDeviceStatusCode(s.status) === 4) return true;
  const iface = s.interface;
  if (iface && typeof iface === "object" && iface.id != null) {
    return normalizeDeviceStatusCode(iface.id) === 4;
  }
  return false;
});

const homeDeviceStatusCode = computed(() => {
  const s = homeDeviceStatus.value;
  if (!s) return -1;
  return normalizeDeviceStatusCode(s.status);
});

/**
 * 标题旁图标：离线 = lixian；使用中(1) = 就绪；其余 = 可点刷新
 */
const homeStatusBarIcon = computed((): "offline" | "ready" | "refresh" => {
  if (!primaryDeviceMac.value) return "refresh";
  if (homeDeviceIsOffline.value) return "offline";
  if (deviceSnapshotLoading.value) return "refresh";
  if (homeDeviceStatusCode.value === 1) return "ready";
  return "refresh";
});

const homeRingTitle = computed((): string => {
  const normalizeSeatText = (text: string) => text.replace(/床/g, "座");
  if (!primaryDeviceMac.value) return "";
  if (deviceSnapshotLoading.value && !homeDeviceStatus.value) return "同步中…";
  if (homeDeviceIsOffline.value) return "设备离线";
  const rtErr = homeDeviceRealtime.value;
  if (rtErr != null && Number(rtErr.ret) === 3) {
    const m = rtErr.msg != null ? String(rtErr.msg).trim() : "";
    return m || "问题";
  }
  if (homeRealtimeErrorText.value) return homeRealtimeErrorText.value;
  const p = homeRealtimeLatest.value;
  if (p?.inbed != null) {
    return p.inbed ? "已就绪" : "已连接 · 离座";
  }
  const s = homeDeviceStatus.value;
  if (s) {
    const iface = s.interface;
    if (iface && typeof iface === "object" && iface.name != null) {
      const n = String(iface.name).trim();
      if (n) {
        const normalized = normalizeSeatText(n);
        return /离线|未激活|无人/.test(normalized) ? normalized : `已连接 · ${normalized}`;
      }
    }
    const code = normalizeDeviceStatusCode(s.status);
    if (code === 3) return "已连接 · 离座";
  }
  return "已连接";
});

const homeStatusSubline = computed((): string => {
  const segs: string[] = [];
  const s = homeDeviceStatus.value;
  if (s && (s.model || s.sn)) {
    segs.push([s.model, s.sn].filter((x) => x && String(x).trim() !== "").join(" / "));
  }
  const p = homeRealtimeLatest.value;
  if (p && !homeDeviceIsOffline.value) {
    if (p.temperature != null && Number.isFinite(Number(p.temperature))) {
      segs.push(`温度 ${Number(p.temperature).toFixed(1)}°C`);
    }
    if (p.humidity != null && Number.isFinite(Number(p.humidity))) {
      segs.push(`湿度 ${Math.round(Number(p.humidity))}%`);
    }
  }
  return segs.filter((x) => x.length > 0).join(" · ");
});

type HomeVitalSlot = {
  side: "左" | "右";
  heartRate: string;
  respirationRate: string;
};

function formatVitalPair(o: { heart_rate?: number; respiration_rate?: number } | null | undefined): {
  heart: string;
  rr: string;
  hasAny: boolean;
} {
  if (!o) {
    return { heart: "—", rr: "—", hasAny: false };
  }
  const hr = o.heart_rate;
  const rrate = o.respiration_rate;
  const hOk = hr != null && Number.isFinite(Number(hr));
  const rOk = rrate != null && Number.isFinite(Number(rrate));
  const heart = hOk ? String(Math.round(Number(hr))) : "—";
  const rr = rOk ? String(Number(rrate).toFixed(1)) : "—";
  return { heart, rr, hasAny: hOk || rOk };
}

function toVitalSlot(side: "左" | "右", f: { heart: string; rr: string }): HomeVitalSlot {
  return { side, heartRate: f.heart, respirationRate: f.rr };
}

const homeHrSlots = computed((): HomeVitalSlot[] => {
  if (homeDeviceIsOffline.value || homeRealtimeErrorText.value) return [];
  const p = homeRealtimeLatest.value;
  if (!p) return [];
  const l = p.left;
  const r = p.right;
  const nL = l?.heart_rate;
  const nR = r?.heart_rate;
  const lNum = nL != null && Number.isFinite(Number(nL)) ? Number(nL) : null;
  const rNum = nR != null && Number.isFinite(Number(nR)) ? Number(nR) : null;
  const lFmt = formatVitalPair(l);
  const rFmt = formatVitalPair(r);
  const lOk = l != null && lFmt.hasAny;
  const rOk = r != null && rFmt.hasAny;
  if (!lOk && !rOk) return [];
  if (lOk && rOk) {
    if (lNum !== null && rNum !== null && lNum > 0 && rNum > 0) {
      return [toVitalSlot("左", lFmt), toVitalSlot("右", rFmt)];
    }
    if (lNum !== null && rNum !== null && lNum > 0 && rNum <= 0) {
      return [toVitalSlot("左", lFmt)];
    }
    if (lNum !== null && rNum !== null && rNum > 0 && lNum <= 0) {
      return [toVitalSlot("右", rFmt)];
    }
    return [toVitalSlot("左", lFmt), toVitalSlot("右", rFmt)];
  }
  if (lOk) return [toVitalSlot("左", lFmt)];
  if (rOk) return [toVitalSlot("右", rFmt)];
  return [];
});

const homeRealtimeErrorText = computed(() => {
  const r = homeDeviceRealtime.value;
  if (!r) return "";
  if (r.ret != null && Number(r.ret) !== 0) {
    return String(r.msg ?? "实时数据暂不可用");
  }
  return "";
});

const homeRealtimeLatest = computed(() => {
  const r = homeDeviceRealtime.value;
  const arr = r?.data;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[arr.length - 1] ?? null;
});

function clearHomeDevicePoll() {
  if (homeDevicePollTimer != null) {
    clearInterval(homeDevicePollTimer);
    homeDevicePollTimer = null;
  }
}

function startHomeDevicePoll() {
  clearHomeDevicePoll();
  if (!userStore.isLoggedIn) return;
  homeDevicePollTimer = setInterval(() => {
    void loadHomeDeviceStatusAndRealtime();
  }, DEVICE_HOME_POLL_MS);
}

async function loadHomeDeviceStatusAndRealtime() {
  const mac = primaryDeviceMac.value;
  if (!userStore.isLoggedIn || !mac) {
    homeDeviceStatus.value = null;
    homeDeviceRealtime.value = null;
    return;
  }
  deviceSnapshotLoading.value = true;
  try {
    const stRes = await fetchDeviceStatus({ mac });
    const st = unwrapApiData<DeviceStatusAppData>(stRes);
    if (st && typeof st === "object") {
      homeDeviceStatus.value = st;
    }
    // 仅「使用中」(status=1) 时拉实时数据，避免无意义请求与误展示旧心率
    const statusCode = st && typeof st === "object" ? normalizeDeviceStatusCode(st.status) : -1;
    if (statusCode !== 1) {
      homeDeviceRealtime.value = null;
      return;
    }
    const rtRes = await postDeviceRealtime({ mac });
    const rt = unwrapApiData<DeviceRealtimePayload>(rtRes);
    if (rt && typeof rt === "object") {
      homeDeviceRealtime.value = rt;
    }
  } catch (e) {
    console.error("loadHomeDeviceStatusAndRealtime", e);
  } finally {
    deviceSnapshotLoading.value = false;
  }
}

/**
 * 「有设备」禅修前：以 GET /app/device/status 为准，必须 status=1（使用中）。
 * 成功时写回 `homeDeviceStatus` 与首页状态一致；失败返回 false。
 */
async function ensurePrimaryDeviceInUseFromApi(): Promise<boolean> {
  const mac = primaryDeviceMac.value;
  if (!mac) {
    uni.showToast({ title: "暂无已绑定的主设备", icon: "none" });
    return false;
  }
  try {
    const stRes = await fetchDeviceStatus({ mac });
    const st = unwrapApiData<DeviceStatusAppData>(stRes);
    if (st && typeof st === "object") {
      homeDeviceStatus.value = st;
    }
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

/**
 * 有进行中禅修时拦截「开始」与场景卡；返回 true 表示可继续。
 */
async function ensureNoActiveMeditationBeforeStart(): Promise<boolean> {
  await meditationStore.fetchActiveSession();
  if (!meditationStore.hasActiveMeditationSession) return true;
  await new Promise<void>((resolve) => {
    uni.showModal({
      title: "提示",
      content: "当前有进行中的禅修，请先在静坐页继续或结束后再开始新的禅修。",
      showCancel: false,
      success: () => {
        resolve();
      },
      fail: () => {
        resolve();
      },
    });
  });
  return false;
}

/** 右下角开始禅修弹窗：根据 Pinia 设备列表生成提示 */
const meditationDeviceDialogMessage = computed(() => deviceStore.meditationDeviceHint);

/** 接口无数据时的占位（与旧版三卡视觉一致） */
const FALLBACK_HOME_ACTIVITIES: ActivityPageListItem[] = [
  {
    id: 90001,
    title: "深夜觉察",
    startDate: null,
    endDate: null,
    content: "静坐于此，观照情绪如深夜之云悄然飘过。",
    isTop: 0,
    templateId: 0,
    teamId: null,
    checkinMode: 0,
    templateName: null,
    templateIcon: null,
    targetMeditationSeconds: 0,
    passPercent: 0,
  },
  {
    id: 90002,
    title: "晨间安宁",
    startDate: null,
    endDate: null,
    content: "旭日东升，呼吸之间，回归你本自具足的宁静。",
    isTop: 0,
    templateId: 1,
    teamId: null,
    checkinMode: 0,
    templateName: null,
    templateIcon: null,
    targetMeditationSeconds: 0,
    passPercent: 0,
  },
  {
    id: 90003,
    title: "午间小憩",
    startDate: null,
    endDate: null,
    content: "于白昼繁杂中，寻得一处内心清明之地。",
    isTop: 0,
    templateId: 2,
    teamId: null,
    checkinMode: 0,
    templateName: null,
    templateIcon: null,
    targetMeditationSeconds: 0,
    passPercent: 0,
  },
];

const DEFAULT_SCENE_IMAGES = [
  "https://images.unsplash.com/photo-1532767153582-b1a0e5145009",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8",
  "",
] as const;


const SCENE_STYLES: Record<
  SceneType,
  { bgClass: string; h2Class: string; spanClass: string; btnClass: string }
> = {
  dark: {
    bgClass: "from-indigo-950/100 via-slate-10/60",
    h2Class: "text-white",
    spanClass: "text-white/60",
    btnClass: "bg-white/10 backdrop-blur-xl",
  },
  light: {
    bgClass: "from-amber-50/100 via-orange-100/60",
    h2Class: "text-[#4a4538]",
    spanClass: "text-[#1a170f]/80",
    btnClass: "bg-theme-10 theme-color-1 border border-primary/10",
  },
  simple: {
    bgClass: "from-blue-50/50 via-white/40",
    h2Class: "text-[#4a4538]",
    spanClass: "text-[#1a170f]/80",
    btnClass: "bg-blue-500/10 text-blue-600 border border-blue-500/10",
  },
};

function sceneTypeForTemplate(templateId: number): SceneType {
  const m = templateId;
  return m === 1 ? "dark" : m === 2 ? "light" : "simple";
}

function resolveActivityMediaUrl(raw: string | null | undefined): string {
  const u = (raw || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("//")) return `https:${u}`;
  const base = config.baseURL.replace(/\/+$/, "");
  const path = u.startsWith("/") ? u : `/${u}`;
  return `${base}${path}`;
}

function activityTimeBadge(item: ActivityPageListItem): string {
  const s = item.startDate?.trim();
  const e = item.endDate?.trim();
  if (s && e) {
    return `${formatDate(s, "MM-DD HH:mm")} - ${formatDate(e, "MM-DD HH:mm")}`;
  }
  if (s) return formatDate(s, "MM-DD HH:mm");
  return "随时共修";
}

function activityDurationLabel(item: ActivityPageListItem): string {
  const time = item.targetMeditationSeconds;
  if (!time) return "自定分钟";
  try {
    return `${time / 60} 分钟`;
  } catch {
    return "自定时间";
  }
}

function sortHomeActivities(
  list: ActivityPageListItem[],
  prefId: number | null,
  prefTid: number | null,
): ActivityPageListItem[] {
  return [...list].sort((a, b) => {
    if (prefId != null) {
      const ah = a.id === prefId ? 1 : 0;
      const bh = b.id === prefId ? 1 : 0;
      if (ah !== bh) return bh - ah;
    }
    if (prefTid != null) {
      const at = a.templateId === prefTid ? 1 : 0;
      const bt = b.templateId === prefTid ? 1 : 0;
      if (at !== bt) return bt - at;
    }
    const top = (b.isTop ?? 0) - (a.isTop ?? 0);
    if (top !== 0) return top;
    return a.id - b.id;
  });
}



function mapToHomeCard(item: ActivityPageListItem): HomeActivityCard {
  const sceneType = sceneTypeForTemplate(item.templateId);
  const st = SCENE_STYLES[sceneType];
  const icon = resolveActivityMediaUrl(item.templateIcon ?? null);
  const fallbackImg = DEFAULT_SCENE_IMAGES[Math.abs(item.templateId) % DEFAULT_SCENE_IMAGES.length];
  return {
    id: item.id,
    templateId: item.templateId,
    targetMeditationSeconds: Number.isFinite(item.targetMeditationSeconds)
      ? Math.max(0, item.targetMeditationSeconds)
      : 0,
    title: item.title?.trim() || "共修活动",
    subtitle: (item.content || "").trim() || "安住当下，与社群一同共修。",
    sceneType,
    bgClass: st.bgClass,
    h2Class: st.h2Class,
    spanClass: st.spanClass,
    btnClass: st.btnClass,
    imgUrl: icon || fallbackImg,
    endTime: activityTimeBadge(item),
    totalTime: activityDurationLabel(item),
    passPercent: item.passPercent,
  };
}

const activitiesRaw = ref<ActivityPageListItem[]>([]);
const activitiesLoading = ref(false);
const activityScrollIntoView = ref("");

const homeActivityCards = computed((): HomeActivityCard[] => {
  const base =
    activitiesRaw.value.length > 0 ? activitiesRaw.value : FALLBACK_HOME_ACTIVITIES;
  const sorted = sortHomeActivities(
    base,
    meditationStore.homePreferredActivityId,
    meditationStore.homePreferredActivityTemplateId,
  );
  return sorted.map(mapToHomeCard);
});

async function scrollPreferredActivityIntoView() {
  await nextTick();
  const cards = homeActivityCards.value;
  if (!cards.length) return;
  const pref = meditationStore.homePreferredActivityId;
  const target =
    pref != null && cards.some((c) => c.id === pref) ? pref : cards[0].id;
  activityScrollIntoView.value = `hm-act-${target}`;
  setTimeout(() => {
    activityScrollIntoView.value = "";
  }, 500);
}

async function loadHomeActivities() {
  activitiesLoading.value = true;
  try {
    const res = await fetchActivityPage({ page: 1, size: 7 });
    const data = unwrapApiData<ActivityPage>(res);
    activitiesRaw.value = data?.list?.length ? data.list : [];
  } catch (e) {
    console.error("fetchActivityPage", e);
    activitiesRaw.value = [];
  } finally {
    activitiesLoading.value = false;
    await scrollPreferredActivityIntoView();
  }
}

/** 从场景卡进入禅修：与右下角「开始」一致，先同步设备再弹窗选有/无设备，确认后再校验并跳转 */
async function startMeditationFromActivity(item: HomeActivityCard) {
  if (userStore.isLoggedIn) {
    const can = await ensureNoActiveMeditationBeforeStart();
    if (!can) return;
  }
  pendingActivityLaunch.value = item;
  if (userStore.isLoggedIn) {
    uni.showLoading({ title: "同步设备状态…", mask: true });
    try {
      await deviceStore.refreshListAndSyncFirstDeviceDetail();
    } finally {
      uni.hideLoading();
    }
  }
  showMeditationDevicePopup.value = true;
}

/** 遮罩或右上角关闭：放弃本次进入禅修，清除场景卡待启动上下文 */
function onMeditationDeviceDialogDismiss() {
  pendingActivityLaunch.value = null;
}

/** conic-gradient：from -90deg 从 12 点顺时针，与触摸 atan2 一致 */
const ringConicStyle = computed(() => {
  const p = ringProgress.value;
  const deg = 360 * p;
  return {
    backgroundImage: `conic-gradient(from -90deg, var(--color-1) 0deg, var(--color-1) ${deg}deg, transparent ${deg}deg)`
  };
});

/**
 * 圆形拖拽点：旋转角 = 360°×进度 − 90°（与 conic / 触摸顺时针进度对齐所需的相位补偿）。
 */
const handleRotateDeg = computed(() => 360 * ringProgress.value - 90);

const timeDisplay = computed(() => {
  const m = Number(durationMinutes.value);
  const safe = Number.isNaN(m) ? minMinutes : m;
  return `${String(safe).padStart(2, '0')}:00`;
});

const minLabel = computed(() => `${String(minMinutes).padStart(2, '0')}:00`);
const maxLabel = computed(() => `${String(maxMinutes).padStart(2, '0')}:00`);

const barPercent = computed(() => ringProgress.value * 100);

function clampMinutes(v: number) {
  if (!Number.isFinite(v)) return minMinutes;
  const n =
    Math.round((v - minMinutes) / stepMinutes) * stepMinutes + minMinutes;
  return Math.min(maxMinutes, Math.max(minMinutes, n));
}

/** 场景卡：用活动目标秒数换算计划分钟（向上取整到分钟，再按 5 分一档夹到 5–300）；无目标则用首页圆环当前值 */
function minutesForActivityLaunch(activity: HomeActivityCard | null): number {
  const fallback = clampMinutes(Number(durationMinutes.value));
  if (!activity) return fallback;
  const sec = activity.targetMeditationSeconds;
  if (!Number.isFinite(sec) || sec <= 0) return fallback;
  return clampMinutes(Math.ceil(sec / 60));
}

/** 当前卡片是否来自接口列表（非本地占位卡），才调打卡接口 */
function isActivityFromApiList(activity: HomeActivityCard): boolean {
  return activitiesRaw.value.some((a) => a.id === activity.id);
}

/** 统一为数字，避免滑条传入 string 时 "15"+1 === "151" */
function setDuration(v: unknown) {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (Number.isNaN(n)) return;
  durationMinutes.value = clampMinutes(n);
}

function adjustMinutes(delta: number) {
  const cur = Number(durationMinutes.value);
  const base = Number.isNaN(cur) ? minMinutes : cur;
  setDuration(base + delta);
}

type AudioTrack = {
  id: string;
  title: string;
  subtitle: string;
  /** 须为 https 或同源可播地址，小程序要求 */
  url: string;
  coverClass: string;
  coverUrl: string;
};

const MUSIC_PAGE_SIZE = 20;

/** 为 true 时使用本地模拟数据（分页仍走滚动加载） */
const USE_MUSIC_MOCK = false;

/** 模拟列表（字段与 mapMusicItem 兼容；url 需为 https 以便小程序播放） */
const MOCK_MUSIC_LIST: Record<string, unknown>[] = [
  {
    id: 'mock-1',
    title: 'Return to Stability',
    subtitle: 'Nature & Flow',
    url: 'http://127.0.0.1:8001/upload/20260410/sssssssss_ab1f2f7659d74396aa142d9baab777fb.m4a',
    coverUrl: ''
  },
  {
    id: 'mock-2',
    title: 'Emotion like clouds',
    subtitle: 'Soft Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: ''
  },
  {
    id: 'mock-3',
    title: 'Forest Whisper',
    subtitle: 'Organic Echoes',
    url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    coverUrl: ''
  },
  ...Array.from({ length: 21 }, (_, i) => ({
    id: `mock-${i + 4}`,
    title: `疗愈音轨 ${String(i + 4).padStart(2, '0')}`,
    subtitle: '模拟数据 · 滚动加载',
    url:
      i % 3 === 0
        ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
        : i % 3 === 1
          ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          : 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    coverUrl: ''
  }))
];

const audioTracks = ref<AudioTrack[]>([]);
/** loadmore | loading | nomore */
const musicLoadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore');
const musicListFinished = ref(false);
const musicFetching = ref(false);
const musicNextPage = ref(1);

const COVER_CLASS_CYCLE = [
  'bg-gradient-to-br from-primary/30 to-background-dark/20',
  'bg-blue-100 dark:bg-blue-900/20',
  'bg-green-100 dark:bg-green-900/20',
  'bg-purple-100 dark:bg-purple-900/20'
];

function mapMusicItem(raw: Record<string, unknown>, index: number): AudioTrack {
  const id = String(raw.id ?? raw.musicId ?? `idx-${index}`);
  const title = String(raw.title ?? raw.name ?? '未命名');
  const coverUrl = String(raw.coverUrl ?? '');
  const subtitle = String(raw.subtitle ?? raw.artist ?? raw.remark ?? raw.description ?? '');
  const url = resolveMusicAssetUrl(
    (raw.url ?? raw.audioUrl ?? raw.fileUrl ?? raw.src ?? raw.path) as string | undefined
  );
  return {
    id,
    title,
    subtitle,
    url,
    coverUrl,
    coverClass: COVER_CLASS_CYCLE[index % COVER_CLASS_CYCLE.length]
  };
}

async function fetchMusicPage(reset: boolean) {
  if (musicFetching.value) return;
  if (musicListFinished.value && !reset) return;

  musicFetching.value = true;
  if (reset) {
    musicNextPage.value = 1;
    audioTracks.value = [];
    musicListFinished.value = false;
  }
  musicLoadStatus.value = 'loading';

  try {
    const page = musicNextPage.value;

    if (USE_MUSIC_MOCK) {
      await new Promise<void>((resolve) => setTimeout(resolve, 260));
      const start = (page - 1) * MUSIC_PAGE_SIZE;
      const slice = MOCK_MUSIC_LIST.slice(start, start + MUSIC_PAGE_SIZE);
      const startIdx = audioTracks.value.length;
      const mapped = slice.map((raw, i) => mapMusicItem(raw, startIdx + i));
      audioTracks.value = audioTracks.value.concat(mapped);
      const got = mapped.length;
      const total = MOCK_MUSIC_LIST.length;
      const noMore = got === 0 || audioTracks.value.length >= total;
      if (noMore) {
        musicListFinished.value = true;
        musicLoadStatus.value = 'nomore';
      } else {
        musicNextPage.value = page + 1;
        musicLoadStatus.value = 'loadmore';
      }
    } else {
      const res = await getMusicPage({ page, size: MUSIC_PAGE_SIZE });
      const data = unwrapApiData<MusicPageData>(res);
      if (!data || !Array.isArray(data.list)) {
        throw new Error('music page: invalid data');
      }
      const startIdx = audioTracks.value.length;
      const mapped = data.list.map((item, i) =>
        mapMusicListItemToRow(item, startIdx + i, COVER_CLASS_CYCLE),
      );
      audioTracks.value = audioTracks.value.concat(mapped);

      const got = mapped.length;
      const total = data.pagination?.total;
      const noMore =
        got === 0 ||
        got < MUSIC_PAGE_SIZE ||
        (typeof total === 'number' && total >= 0 && audioTracks.value.length >= total);

      if (noMore) {
        musicListFinished.value = true;
        musicLoadStatus.value = 'nomore';
      } else {
        musicNextPage.value = page + 1;
        musicLoadStatus.value = 'loadmore';
      }
    }
  } catch (e) {
    console.error('getMusicPage', e);
    musicLoadStatus.value = audioTracks.value.length ? 'nomore' : 'loadmore';
    uni.showToast({ title: '音乐列表加载失败', icon: 'none' });
  } finally {
    musicFetching.value = false;
    applyLastMeditationTrackSelection();
  }
}

function onMusicScrollToLower() {
  if (!musicListFinished.value && !musicFetching.value) {
    fetchMusicPage(false);
  }
}

function loadMoreMusic() {
  if (musicLoadStatus.value === 'loadmore' && !musicListFinished.value && !musicFetching.value) {
    fetchMusicPage(false);
  }
}

/** 列表加载后尽量选中上次禅修使用的音乐（按 trackId，其次 url） */
function applyLastMeditationTrackSelection() {
  if (!audioTracks.value.length) return;
  const id = meditationStore.lastMeditationTrackId;
  const url = meditationStore.lastMeditationTrackUrl;
  if (id) {
    const hit = audioTracks.value.find((t) => t.id === id);
    if (hit) {
      selectedTrackId.value = hit.id;
      return;
    }
  }
  if (url) {
    const byUrl = audioTracks.value.find((t) => t.url === url);
    if (byUrl) {
      selectedTrackId.value = byUrl.id;
      return;
    }
  }
  if (!selectedTrackId.value && audioTracks.value[0]) {
    selectedTrackId.value = audioTracks.value[0].id;
  }
}

onMounted(() => {
  const m = meditationStore.lastMeditationPlannedMinutes;
  if (m != null && m > 0) {
    durationMinutes.value = clampMinutes(m);
  } else {
    try {
      const legacy = uni.getStorageSync("meditation_duration_minutes");
      const n = Number(legacy);
      if (!Number.isNaN(n) && n > 0) {
        durationMinutes.value = clampMinutes(n);
      }
    } catch {
      /* noop */
    }
  }
  fetchMusicPage(true);
});

onShow(async () => {
  loadMessageUnreadCount();
  void loadHomeActivities();
  if (userStore.isLoggedIn) {
    await deviceStore.refreshList();
    void meditationStore.fetchActiveSession();
    void loadHomeDeviceStatusAndRealtime();
    startHomeDevicePoll();
  } else {
    homeDeviceStatus.value = null;
    homeDeviceRealtime.value = null;
    clearHomeDevicePoll();
  }
});

onHide(() => {
  clearHomeDevicePoll();
});

const playingId = ref<string | null>(null);
const selectedTrackId = ref<string | null>(null);
let innerAudio: UniApp.InnerAudioContext | null = null;
let previewBgAudio: UniApp.BackgroundAudioManager | null = null;
let previewBgEndedHandler: (() => void) | null = null;
let previewBgErrorHandler: ((err: unknown) => void) | null = null;

const currentTrackTitle = computed(() => {
  const selectedId = selectedTrackId.value || playingId.value;
  const t = audioTracks.value.find((x: AudioTrack) => x.id === selectedId);
  return t?.title || '音乐播放（开始播放）';
});

function ensureAudio() {
  if (innerAudio) return innerAudio;
  innerAudio = uni.createInnerAudioContext();
  innerAudio.obeyMuteSwitch = false;
  innerAudio.onEnded(() => {
    playingId.value = null;
  });
  innerAudio.onError((err) => {
    console.error('audio error', err);
    playingId.value = null;
    uni.showToast({ title: '音频无法播放，请检查网络或更换地址', icon: 'none' });
  });
  return innerAudio;
}

function ensurePreviewBackgroundAudio() {
  // #ifdef MP-WEIXIN
  if (previewBgAudio) return previewBgAudio;
  const bg = uni.getBackgroundAudioManager();
  previewBgAudio = bg;
  previewBgEndedHandler = () => {
    playingId.value = null;
  };
  previewBgErrorHandler = (err) => {
    console.error('background audio error', err);
    playingId.value = null;
    uni.showToast({ title: '音频无法播放，请检查网络或更换地址', icon: 'none' });
  };
  bg.onEnded(previewBgEndedHandler);
  bg.onError(previewBgErrorHandler);
  return bg;
  // #endif

  return null;
}

function stopAudio() {
  // #ifdef MP-WEIXIN
  if (previewBgAudio) {
    try {
      previewBgAudio.stop();
    } catch {
      /* noop */
    }
  }
  // #endif

  if (!innerAudio) return;
  try {
    innerAudio.stop();
  } catch {
    /* noop */
  }
}

function togglePlay(track: AudioTrack) {
  if (!track.url) {
    uni.showToast({ title: '无效音频地址', icon: 'none' });
    return;
  }
  selectedTrackId.value = track.id;

  // #ifdef MP-WEIXIN
  const bg = ensurePreviewBackgroundAudio();
  if (!bg) return;
  if (playingId.value === track.id) {
    try {
      bg.pause();
    } catch {
      /* noop */
    }
    playingId.value = null;
    return;
  }
  stopAudio();
  bg.title = track.title || '疗愈音乐';
  bg.epname = '疗愈音乐';
  bg.singer = '静心';
  bg.coverImgUrl = '/static/logo.png';
  bg.src = track.url;
  playingId.value = track.id;
  try {
    bg.play();
  } catch {
    /* noop */
  }
  return;
  // #endif

  const ctx = ensureAudio();
  if (playingId.value === track.id) {
    ctx.pause();
    playingId.value = null;
    return;
  }
  stopAudio();
  ctx.src = track.url;
  playingId.value = track.id;
  ctx.play();
}

/** 拉列表 + 首台设备详情，再弹出「有/无设备」选择 */
async function onStartMeditation() {
  if (userStore.isLoggedIn) {
    const can = await ensureNoActiveMeditationBeforeStart();
    if (!can) return;
  }
  pendingActivityLaunch.value = null;
  if (userStore.isLoggedIn) {
    uni.showLoading({ title: "同步设备状态…", mask: true });
    try {
      await deviceStore.refreshListAndSyncFirstDeviceDetail();
    } finally {
      uni.hideLoading();
    }
  }
  showMeditationDevicePopup.value = true;
}

/** 有设备 / 无设备：与 `onStartMeditation` 相同校验；若来自场景卡则打卡、按计划目标分钟并附带活动 id */
async function confirmStartMeditationWithDevice(hasDevice: boolean) {
  if (userStore.isLoggedIn) {
    const can = await ensureNoActiveMeditationBeforeStart();
    if (!can) {
      showMeditationDevicePopup.value = false;
      onMeditationDeviceDialogDismiss();
      return;
    }
  }
  if (hasDevice && userStore.isLoggedIn) {
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
  const activity = pendingActivityLaunch.value;
  if (activity && userStore.isLoggedIn && isActivityFromApiList(activity)) {
    uni.showLoading({ title: "活动打卡中…", mask: true });
    try {
      const body: ActivityCheckinDTO = { id: activity.id };
      try {
        // const pos = await getCurrentLatLng();
        // body.lat = pos.latitude;
        // body.lng = pos.longitude;
        // if (pos.accuracy != null) body.accuracy = pos.accuracy;
      } catch {
        /* 与活动详情页一致：无定位时仅传 id */
      }
      await postActivityCheckin(body);
    } catch (e) {
      console.error("postActivityCheckin", e);
      uni.showToast({ title: "活动打卡失败，请稍后重试", icon: "none" });
      return;
    } finally {
      uni.hideLoading();
    }
  }

  const selected =
    audioTracks.value.find((x) => x.id === selectedTrackId.value) ||
    audioTracks.value.find((x) => x.id === playingId.value) ||
    audioTracks.value[0];
  stopAudio();
  playingId.value = null;

  const plannedMinutes = minutesForActivityLaunch(activity);
  const payload: NextMeditationLaunchPayload = {
    durationMinutes: plannedMinutes,
    trackId: selected?.id ? String(selected.id) : "",
    trackTitle: activity
      ? selected?.title?.trim() || activity.title
      : selected?.title?.trim() || "疗愈音频",
    trackUrl: selected?.url || "",
    useHardwareDevice: hasDevice,
  };
  if (activity) {
    payload.activityId = activity.id;
    payload.activityTemplateId = activity.templateId;
  }
  pendingActivityLaunch.value = null;

  meditationStore.applyNextMeditationLaunch(payload);
  uni.navigateTo({
    url: "/pages/meditation/startMeditaiton",
  });
}

function touchViewportXY(touch: Touch) {
  const anyTouch = touch as Touch & { x?: number; y?: number };
  const x = anyTouch.clientX ?? anyTouch.pageX ?? anyTouch.x;
  const y = anyTouch.clientY ?? anyTouch.pageY ?? anyTouch.y;
  return { x: x ?? 0, y: y ?? 0 };
}

function createPageSelectorQuery() {
  const inst = getCurrentInstance();
  const q = uni.createSelectorQuery();
  return inst?.proxy ? q.in(inst.proxy) : q;
}

function minutesFromClientX(clientX: number, rect: UniApp.NodeInfo) {
  const w = rect.width || 1;
  const x = clientX - (rect.left || 0);
  const ratio = Math.min(1, Math.max(0, x / w));
  return clampMinutes(minMinutes + ratio * (maxMinutes - minMinutes));
}

function onBarTouch(e: TouchEvent) {
  const type = e.type;
  if (type === 'touchstart') barDragging.value = true;
  if (type === 'touchend' || type === 'touchcancel') barDragging.value = false;

  const touch = e.touches?.[0] || e.changedTouches?.[0];
  if (!touch) return;
  const { x: clientX } = touchViewportXY(touch);
  createPageSelectorQuery()
    .select('.duration-track')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return;
      setDuration(minutesFromClientX(clientX, rect));
    })
    .exec();
}

function onRingTouch(e: TouchEvent) {
  const touch = e.touches?.[0] || e.changedTouches?.[0];
  if (!touch) return;
  const { x: clientX, y: clientY } = touchViewportXY(touch);
  createPageSelectorQuery()
    .select('.ring-touch-area')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return;
      const cx = (rect.left || 0) + (rect.width || 0) / 2;
      const cy = (rect.top || 0) + (rect.height || 0) / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      let theta = Math.atan2(dx, -dy);
      // 拖拽点显示角度做了 -90°，触摸换算对应补 +90°，保证手指与拖拽点一致
      theta += Math.PI / 2;
      if (theta < 0) theta += 2 * Math.PI;
      if (theta >= 2 * Math.PI) theta -= 2 * Math.PI;
      const ratio = theta / (2 * Math.PI);
      setDuration(minMinutes + ratio * (maxMinutes - minMinutes));
    })
    .exec();
}

function disposeAudio() {
  stopAudio();

  // #ifdef MP-WEIXIN
  if (previewBgAudio) {
    try {
      if (previewBgEndedHandler && typeof (previewBgAudio as any).offEnded === 'function') {
        (previewBgAudio as any).offEnded(previewBgEndedHandler);
      }
    } catch {
      /* noop */
    }
    try {
      if (previewBgErrorHandler && typeof (previewBgAudio as any).offError === 'function') {
        (previewBgAudio as any).offError(previewBgErrorHandler);
      }
    } catch {
      /* noop */
    }
  }
  previewBgAudio = null;
  previewBgEndedHandler = null;
  previewBgErrorHandler = null;
  // #endif

  if (innerAudio) {
    innerAudio.destroy();
    innerAudio = null;
  }
}

onUnload(disposeAudio);
onBeforeUnmount(disposeAudio);
</script>

<style scoped lang="scss">
.meditation-page {
  --meditation-glow: rgba(212, 175, 53, 0.35);
}

.music-up-list {
  width: 100%;
}


.glow-blob {
  animation: meditation-glow 5s ease-in-out infinite;
}

.float-ring {
  animation: meditation-float 6s ease-in-out infinite;
}

.label-shimmer {
  animation: label-shimmer 3s ease-in-out infinite;
}

.ring-border-pulse {
  animation: ring-border-pulse 4s ease-in-out infinite;
}

.thumb-pulse {
  animation: thumb-pulse 2.2s ease-in-out infinite;
}

/* 与填充右边缘对齐：圆点中心 = 进度比例位置 */
.thumb-center {
  transform: translate(-50%, -50%);
}

.music-icon-bob {
  animation: music-bob 2.5s ease-in-out infinite;
}

.handle-dot {
  transition: transform 0.2s ease-out;
}

/* 进度环：与 ring-track-border / ring-progress-hole 同宽，保证与 conic 同心 */
.ring-progress-stack {
  --ring-band: 12rpx;
}

.ring-track-border {
  box-sizing: border-box;
  border: var(--ring-band) solid var(--color-10);
  border-radius: 50%;
}

.ring-progress-conic {
  border-radius: 50%;
}

.ring-progress-hole {
  position: absolute;
  left: var(--ring-band);
  right: var(--ring-band);
  top: var(--ring-band);
  bottom: var(--ring-band);
  z-index: 1;
  background-color: var(--color-11);
  box-sizing: border-box;
}

.track-fill-anim {
  transition: width 0.2s ease-out;
}

.btn-press {
  transition: transform 0.15s ease;
}

.btn-press-active {
  transform: scale(0.92);
}

.btn-press-start {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.btn-press-start:active {
  transform: scale(0.98);
}

.audio-card-anim {
  animation: meditation-float 8s ease-in-out infinite;
  animation-delay: -2s;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

@keyframes device-refresh-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.device-refresh-scan-icon--spinning {
  display: block;
  animation: device-refresh-spin 0.85s linear infinite;
  transform-origin: 50% 50%;
}
</style>